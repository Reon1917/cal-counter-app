import { createClient } from '../lib/supabase/server'
import { redirect } from 'next/navigation'
import CameraCapture from './components/CameraCapture'
import MainLayout from './components/MainLayout'

export default async function Home() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <MainLayout user={user}>
      <CameraCapture />
    </MainLayout>
  )
}
