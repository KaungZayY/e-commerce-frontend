<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

            <form @submit.prevent="handleLogin" class="space-y-4">
                <!-- Email -->
                <Textbox id="email" label="Email" type="email" placeholder="you@example.com" v-model="email"
                    :required="true" :error="errors.email ? errors.email[0] : ''" />

                <!-- Password -->
                <Textbox id="password" label="Password" type="password" placeholder="********" v-model="password"
                    :required="true" :error="errors.password ? errors.password[0] : ''" />

                <!-- Login Button -->
                <LoadingBtn :label="'Login'" :loading-label="'Logging in...'" :loading="loading" type="submit"
                    class="w-full" />
            </form>

            <!-- Optional links -->
            <p class="mt-4 text-sm text-gray-600 text-center">
                Don't have an account?
                <NuxtLink to="/auth/register" class="text-blue-600 hover:underline">Sign up</NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

definePageMeta({
    layout: 'guest'
})

const email = ref('');
const password = ref('');
const loading = ref(false);

const errors = ref({});
const router = useRouter();

const handleLogin = async () => {
    loading.value = true;
    errors.value = {}
    const payload = {
        email: email.value,
        password: password.value,
    }
    try {
        const response = await useApi('/login', {
            method: 'POST',
            body: payload,
        })
        // console.log(response)
        localStorage.setItem('token', response.token);
        localStorage.setItem('id', response.user.id);
        localStorage.setItem('user_name', response.user.name);
        localStorage.setItem('user_role', response.user.user_role_id);
        toast.success('Login Successful!')
        router.push('/');
    } catch (error) {
        // console.log(error)
        if (error.statusCode === 422 && error.data?.errors) {
            errors.value = error.data.errors;
            // console.log(errors.value)
            toast.error('Please fix the validation errors.')
        }
        else if (error?.statusCode === 401) {
            toast.error('Incorrect Credentials.')
        } else {
            // Other server errors
            toast.error('Login failed. Please try again.')
        }
    } finally {
        loading.value = false;
    }

};
</script>
