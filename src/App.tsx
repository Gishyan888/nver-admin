import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { RequireAuth } from './auth/RequireAuth'
import { ForgotPasswordPlaceholder } from './pages/ForgotPasswordPlaceholder'
import { HomePlaceholder } from './pages/HomePlaceholder'
import { LoginPage } from './pages/LoginPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPlaceholder />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomePlaceholder />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
