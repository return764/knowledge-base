import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react'
import { Fragment, useState } from 'react'
import ModelSettings from "../components/settings/ModelSettings.tsx";

const menuItems = [
  { name: '模型设置', component: () => <ModelSettings/> }
]

const Settings = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="container mx-auto py-6 px-1">
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="flex flex-col gap-4">
          {/* 顶部菜单 */}
          <TabList className="flex border-b border-gray-200">
            {menuItems.map((item) => (
              <Tab as={Fragment} key={item.name}>
                {({ selected }) => (
                  <button
                    className={`py-2 px-4 text-sm font-medium border-b-2 focus:outline-none ${
                      selected
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {item.name}
                  </button>
                )}
              </Tab>
            ))}
          </TabList>

          {/* 下方内容区域 */}
          <TabPanels>
            {menuItems.map((item) => (
              <TabPanel
                key={item.name}
                className="shadow"
              >
                <item.component />
              </TabPanel>
            ))}
          </TabPanels>
        </div>
      </TabGroup>
    </div>
  )
}

export default Settings
