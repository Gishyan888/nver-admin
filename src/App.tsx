import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { RequireAuth } from './auth/RequireAuth'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LoginPage } from './pages/LoginPage'
import { OrderDetailsGiftOptionsHost } from './pages/OrderDetailsGiftOptionsHost'
import { OrdersPage } from './pages/OrdersPage'
import { ReviewsPage } from './pages/ReviewsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<OrdersPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route
              path="/orders/:giftRequestId"
              element={<OrderDetailsGiftOptionsHost />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
