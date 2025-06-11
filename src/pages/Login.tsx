import { FC, useEffect, useRef, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface LoginFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginFormElements;
}

const Login: FC = () => {
  const { user, loginUser, error } = useAuthStore();
  const navigate = useNavigate();
  
  const loginForm = useRef<LoginFormElement>(null);

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loginForm.current) {
      const email = loginForm.current.elements.email.value;
      const password = loginForm.current.elements.password.value;
      loginUser({ email, password });
    }
  }

  return (
    <div className="h-screen flex items-center bg-[url('/fish_bowl.svg')] 
    bg-no-repeat bg-[length:50%] bg-[position:right_top]">
      <div className='mx-auto'>
        <form ref={loginForm} onSubmit={handleSubmit}>
          <div className="mx-0 my-[1em]">
            <label htmlFor="email">Email:</label>
            <input
              className="bg-white border border-black p-4 w-full text-black outline-none"
              required
              type="email"
              id="email"
              name="email"
              placeholder="Enter email..."
            />
          </div>

          <div className="mx-0 my-[1em]">
            <label htmlFor="password">Password:</label>
            <input
              className="bg-white border border-black p-4 w-full text-black outline-none"
              required
              type="password"
              id="password"
              name="password"
              placeholder="Enter password..."
            />
          </div>

          {error && (
            <div className="text-red-500 mb-4">
              {error.message}
            </div>
          )}

          <div className="mx-0 my-[1em]">
            <button 
              type="submit"
              className="rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative">Log In</span>
            </button>
          </div>
        </form>
        <p>Don't have an account? <Link className='link link-info' to="/register">Register</Link></p>
      </div>
    </div>
  )
}

export default Login