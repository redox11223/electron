// Layout.js
import { useState } from 'react'
import Header from './Header'
import { MainContent } from './MainContent'
import Sidebar from './Sidebar'

export const Layout = ({ userEmail }) => {
  const [activeView, setActiveView] = useState('productos')

  return (
    <div className="container-fluid p-0">
      <Header userEmail={userEmail} />
      <div className="row g-0" style={{ minHeight: 'calc(100vh - 80px)', marginTop: '80px' }}>
        <div className="col-1">
          <Sidebar setActiveView={setActiveView} />
        </div>
        <div className="col-11" >
          <MainContent activeView={activeView} />
        </div>
      </div>
    </div>
  )
}

export default Layout
