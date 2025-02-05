import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const { register: signUp } = useAuth()
  const navigate = useNavigate()
  const password = watch('password')

  const onSubmit = async ({ email, password }) => {
    try {
      await signUp(email, password)
      toast.success('Registration successful! Please log in.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      navigate('/login')
    } catch (error) {
      console.error(error.message)
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    }
  }

  return (
    <div className="container py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            {...register('password', { required: 'Password is required' })}
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Confirm Password</label>
          <input
            {...register('confirmPassword', { 
              required: 'Confirm Password is required',
              validate: value => value === password || 'The passwords do not match'
            })}
            type="password"
            placeholder="Confirm your password"
            className="w-full p-2 border rounded"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}
