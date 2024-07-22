import { useState } from 'react'
import Header from './components/Header'
import Resume from './components/Resume'
import TablesView from './components/Manager/TablesView'
import CreateForms from './components/CreateForms/Forms'
import SideMenu from './components/SideMenu'

function App() {
  const [openResume, setOpenResume] = useState(false)
  const [openLogs, setOpenLogs] = useState(false)
  const [openCreateCategories, setOpenCreateCategories] = useState(true)
  const localUser = {
    id: 1,
    name: "John Doe",
    email: "",
  }
  return (
    <div className="bg-bgPalette min-h-full flex flex-col">
      <Header />
      <div className="flex flex-row w-full">
        <SideMenu OnResume={setOpenResume} OnLogs={setOpenLogs} OnCreateCategories={setOpenCreateCategories} />
        {openResume && <Resume localUser={localUser} />}
        {openLogs && <TablesView localUser={localUser} />}
        {openCreateCategories && <CreateForms localUser={localUser} />}
      </div>
    </div>
  );
}

export default App;
