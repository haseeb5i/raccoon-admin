'use client'

// Next UI Provider
import { NextUIProvider } from '@nextui-org/react'

// Toast Provider
import { Toaster } from 'react-hot-toast'

// Redux Provider
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextUIProvider>
      <ReduxProvider store={store}>
        <Toaster position='top-center' />
        {children}
      </ReduxProvider>
    </NextUIProvider>
  )
}
