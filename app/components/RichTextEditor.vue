<template>
    <div class="mb-2 space-y-1 py-2 w-full">
        <label :for="id" class="block text-sm py-1 text-gray-700">
            {{ label }}
            <span v-if="required" class="text-red-500 ml-1">*</span>
        </label>

        <div :class="[
            'w-full border border-gray-500 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-500',
            error ? 'border-red-500 focus-within:ring-red-500' : '',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            inputClass
        ]">
            <!-- Toolbar -->
            <div class="border-b border-gray-300 p-2 bg-gray-50 rounded-t-md">
                <div class="flex flex-wrap items-center gap-1">
                    <!-- Text Formatting -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
                        <button type="button" @click="editor?.chain().focus().toggleBold().run()"
                            :class="['px-2 py-1 rounded text-sm font-bold hover:bg-gray-200', editor?.isActive('bold') ? 'bg-gray-300' : '']"
                            :disabled="disabled">
                            B
                        </button>
                        <button type="button" @click="editor?.chain().focus().toggleItalic().run()"
                            :class="['px-2 py-1 rounded text-sm italic hover:bg-gray-200', editor?.isActive('italic') ? 'bg-gray-300' : '']"
                            :disabled="disabled">
                            I
                        </button>
                        <button type="button" @click="editor?.chain().focus().toggleUnderline().run()"
                            :class="['px-2 py-1 rounded text-sm underline hover:bg-gray-200', editor?.isActive('underline') ? 'bg-gray-300' : '']"
                            :disabled="disabled">
                            U
                        </button>
                        <button type="button" @click="editor?.chain().focus().toggleStrike().run()"
                            :class="['px-2 py-1 rounded text-sm line-through hover:bg-gray-200', editor?.isActive('strike') ? 'bg-gray-300' : '']"
                            :disabled="disabled">
                            S
                        </button>
                    </div>

                    <!-- Headings -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
                        <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
                            :class="['px-2 py-1 rounded text-sm font-bold hover:bg-gray-200', editor?.isActive('heading', { level: 1 }) ? 'bg-gray-300' : '']"
                            :disabled="disabled">
                            H1
                        </button>
                        <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
                            :class="['px-2 py-1 rounded text-sm font-bold hover:bg-gray-200', editor?.isActive('heading', { level: 2 }) ? 'bg-gray-300' : '']"
                            :disabled="disabled">
                            H2
                        </button>
                        <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
                            :class="['px-2 py-1 rounded text-sm font-bold hover:bg-gray-200', editor?.isActive('heading', { level: 3 }) ? 'bg-gray-300' : '']"
                            :disabled="disabled">
                            H3
                        </button>
                    </div>

                    <!-- Text Alignment (removed - not available) -->

                    <!-- Lists -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
                        <button type="button" @click="editor?.chain().focus().toggleBulletList().run()"
                            :class="['px-2 py-1 rounded text-sm hover:bg-gray-200', editor?.isActive('bulletList') ? 'bg-gray-300' : '']"
                            :disabled="disabled">
                            •
                        </button>
                        <button type="button" @click="editor?.chain().focus().toggleOrderedList().run()"
                            :class="['px-2 py-1 rounded text-sm hover:bg-gray-200', editor?.isActive('orderedList') ? 'bg-gray-300' : '']"
                            :disabled="disabled">
                            1.
                        </button>
                    </div>

                    <!-- Quote -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
                        <button type="button" @click="editor?.chain().focus().toggleBlockquote().run()"
                            :class="['px-2 py-1 rounded text-sm hover:bg-gray-200', editor?.isActive('blockquote') ? 'bg-gray-300' : '']"
                            :disabled="disabled">
                            "
                        </button>
                    </div>

                    <!-- Links & HR -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
                        <button type="button" @click="setLink"
                            :class="['px-2 py-1 rounded text-sm hover:bg-gray-200', editor?.isActive('link') ? 'bg-gray-300' : '']"
                            :disabled="disabled">
                            🔗
                        </button>
                        <button type="button" @click="editor?.chain().focus().setHorizontalRule().run()"
                            class="px-2 py-1 rounded text-sm hover:bg-gray-200" :disabled="disabled">
                            —
                        </button>
                    </div>

                    <!-- Undo/Redo -->
                    <div class="flex items-center gap-1">
                        <button type="button" @click="editor?.chain().focus().undo().run()"
                            class="px-2 py-1 rounded text-sm hover:bg-gray-200"
                            :disabled="disabled || !editor?.can().undo()">
                            ↶
                        </button>
                        <button type="button" @click="editor?.chain().focus().redo().run()"
                            class="px-2 py-1 rounded text-sm hover:bg-gray-200"
                            :disabled="disabled || !editor?.can().redo()">
                            ↷
                        </button>
                    </div>
                </div>
            </div>

            <!-- Editor Content -->
            <div ref="editorRef" :class="[
                'prose max-w-none p-3 focus:outline-none',
                disabled ? 'pointer-events-none bg-gray-50' : ''
            ]" :style="{ minHeight: `${rows * 1.5 + 2}rem` }"></div>
        </div>

        <p v-if="error" class="text-sm text-red-500">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    id: string
    inputClass?: string
    error?: string
    required?: boolean
    disabled?: boolean
    rows?: number
}>(), {
    rows: 6,
    placeholder: 'Start typing...'
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref()
let editor: Editor | null = null

onMounted(() => {
    editor = new Editor({
        element: editorRef.value,
        extensions: [
            StarterKit.configure({
                history: {
                    depth: 100,
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: props.modelValue,
        editable: !props.disabled,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            if (html !== props.modelValue) {
                emit('update:modelValue', html)
            }
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none',
                'data-placeholder': props.placeholder,
            },
        },
    })
})

onBeforeUnmount(() => {
    editor?.destroy()
})

watch(() => props.modelValue, (newValue) => {
    const currentValue = editor?.getHTML()
    if (currentValue && currentValue !== newValue) {
        editor?.commands.setContent(newValue, false)
    }
})

watch(() => props.disabled, (disabled) => {
    editor?.setEditable(!disabled)
})

const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
        return
    }

    if (url === '') {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run()
        return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
</script>

<style>
.ProseMirror {
    outline: none;
    line-height: 1.6;
}

.ProseMirror p {
    margin: 0.5em 0;
}

.ProseMirror p:first-child {
    margin-top: 0;
}

.ProseMirror p:last-child {
    margin-bottom: 0;
}

.ProseMirror h1,
.ProseMirror h2,
.ProseMirror h3,
.ProseMirror h4,
.ProseMirror h5,
.ProseMirror h6 {
    margin: 1em 0 0.5em 0;
    font-weight: bold;
}

.ProseMirror h1 {
    font-size: 2em;
}

.ProseMirror h2 {
    font-size: 1.5em;
}

.ProseMirror h3 {
    font-size: 1.25em;
}

.ProseMirror h4 {
    font-size: 1.1em;
}

.ProseMirror h5 {
    font-size: 1em;
}

.ProseMirror h6 {
    font-size: 0.9em;
}

.ProseMirror ul,
.ProseMirror ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
}

/* ADD THESE TWO LINES */
.ProseMirror ul {
    list-style-type: disc;
}

.ProseMirror ol {
    list-style-type: decimal;
}

.ProseMirror li {
    margin: 0.25em 0;
}

.ProseMirror blockquote {
    margin: 1em 0;
    padding-left: 1em;
    border-left: 3px solid #ddd;
    color: #666;
    font-style: italic;
}

.ProseMirror code {
    background-color: #f1f5f9;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
}

.ProseMirror pre {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 1em;
    margin: 1em 0;
    overflow-x: auto;
}

.ProseMirror pre code {
    background: none;
    padding: 0;
    border-radius: 0;
}

.ProseMirror hr {
    margin: 2em 0;
    border: none;
    border-top: 1px solid #e5e7eb;
}

.ProseMirror a {
    color: #3b82f6;
    text-decoration: underline;
}

.ProseMirror a:hover {
    color: #1d4ed8;
}

.ProseMirror strong {
    font-weight: bold;
}

.ProseMirror em {
    font-style: italic;
}

.ProseMirror u {
    text-decoration: underline;
}

.ProseMirror s {
    text-decoration: line-through;
}

/* Placeholder styling */
.ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #9ca3af;
    pointer-events: none;
    height: 0;
}
</style>