import React from 'react'
import type {FC} from 'react'
import {Navbar} from '../Navbar'
import styles from './Layout.module.css'

export type LayoutProps = {
  children: React.ReactNode
}

export const Layout: FC<LayoutProps> = ({children}) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Navbar />
          {children}
        </div>
      </div>
    </>
  )
}
