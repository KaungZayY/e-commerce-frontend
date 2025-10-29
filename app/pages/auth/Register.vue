<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="relative w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <!-- Header row -->
            <div class="relative mb-6 flex items-center justify-center">
                <LoadingBtn icon="arrow-left" variant="neutral" type="button" class="absolute left-0 w-auto"
                    @click="goBack" />
                <h2 class="text-2xl font-bold text-gray-800 text-center">
                    Create an Account
                </h2>
            </div>
            <form @submit.prevent="handleRegister" class="space-y-4">
                <Textbox id="name" label="Name" placeholder="John Smith" v-model="name" :required="true"
                    :error="errors.name ? errors.name[0] : ''" />
                <Textbox id="email" label="Email" type="email" placeholder="you@example.com" v-model="email"
                    :required="true" :error="errors.email ? errors.email[0] : ''" />
                <Textbox id="password" label="Password" type="password" placeholder="********" v-model="password"
                    :required="true" :error="errors.password ? errors.password[0] : ''" />
                <Textbox id="password_confirmation" label="Confirm Password" type="password" placeholder="********"
                    v-model="password_confirmation" :required="true"
                    :error="errors.password_confirmation ? errors.password_confirmation[0] : ''" />
                <LoadingBtn :label="'Register'" :loading-label="'creating an account...'" :loading="loading"
                    type="submit" class="w-full" />
            </form>
        </div>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

definePageMeta({
    layout: 'guest'
})

const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('')
const loading = ref(false);

const errors = ref({});
const router = useRouter();

const goBack = () => {
    router.push('/auth/login');
}

const handleRegister = async () => {
    loading.value = true;
    errors.value = {}
    const payload = {
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: password_confirmation.value,
    }
    try {
        const response = await useApi('/register', {
            method: 'POST',
            body: payload,
        })
        // console.log(response)
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_name', response.user.name);
        localStorage.setItem('user_role', response.user.user_role_id);
        toast.success('Account Successfully Created!')
        router.push('/');
    } catch (error) {
        if (error.statusCode === 422 && error.data?.errors) {
            errors.value = error.data.errors;
            // console.log(errors.value)
            toast.error('Please fix the validation errors.')
        }
        else if (error?.statusCode === 401) {
            toast.error('Incorrect Credentials.')
        } else {
            // Other server errors
            toast.error('Action failed. Please try again.')
        }
    } finally {
        loading.value = false;
    }

};
</script>