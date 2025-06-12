import ExperienceManager from '@/components/ExperienceManager'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ExperiencePage() {
  return (
    <div className="container mx-auto mt-4">
      <ExperienceManager />
      <ToastContainer />
    </div>
  )
}

