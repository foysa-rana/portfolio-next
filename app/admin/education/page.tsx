import EducationManager from '@/components/EducationManager'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function EducationPage() {
  return (
    <div className="container mx-auto mt-4">
      <EducationManager />
      <ToastContainer />
    </div>
  )
}

