import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import projApi from '../apis/projApi'
import authApi from '../apis/authApi'
import { InitializeSocket,receiveMessage,sendMessage } from '../config/socket'

function Project() {
 const location = useLocation() // geting data send using navigate hook
 const [isSidePanelOpen, setisSidePanelOpen] = useState(false)
 const [isModalOpen, setisModalOpen] = useState(false)
 const [ selectedUserId, setSelectedUserId ] = useState(new Set())
 const [project, setproject] = useState(location.state)
 const [users, setusers] = useState([])
 const [message, setmessage] = useState('')

   useEffect(() => {
       InitializeSocket(project._id);
       receiveMessage('project-message',(data)=>{
           console.log(data)
       })
     authApi.allUser().then((res)=>setusers(res.data.users)).catch(err=> console.log(err))
    projApi.getDetails({projectId: location.state._id}).then(res => setproject(res.data.project)).catch(err=> console.log(err))
   }, [])
   
   const handleUserClick =(id)=>{
    setSelectedUserId(prevSelectedUserId => {
        const newSelectedUserId = new Set(prevSelectedUserId);
        if (newSelectedUserId.has(id)) {
            newSelectedUserId.delete(id);
        } else {
            newSelectedUserId.add(id);
        }

        return newSelectedUserId;
    });
   }
   const addCollaborators = async()=>{
    await projApi.addUsers({projectId:location.state._id, users:Array.from(selectedUserId)})
   }
   const send = ()=>{
    console.log("sending")
    sendMessage('project-message',{
        message,
        sender: localStorage.getItem('user')
    })
   }
  return (
   <>
   <main className='h-screen w-screen flex'>
    <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
        <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100 '>
            <button className='flex gap-2' onClick={() => setisModalOpen(true)}> 
            <i className="ri-add-fill mr-1"></i>
            <p>Add Colaborator</p>
            </button>
            <button  className='p-2' onClick={()=>setisSidePanelOpen(!isSidePanelOpen)}>
            <i className="ri-group-fill"></i>
            </button>
        </header>
        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
            <div   className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide">
                <div className="incoming max-w-56 message flex flex-col p-2 bg-slate-50 w-fit rounded-md">
                    <small className='opacity-65 text-xs'>example@gmail.com</small>
                    <div className='text-sm' >

                    Lorem ipsum dolor sit amet.fdgfdgdgfdggfd Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt praesentium porro, id asperiores quis voluptatum vitae dolorum doloribus rerum aspernatur, quo iusto, eligendi fugit delectus.
                    </div>
                </div>

                <div className="outgoing ml-auto max-w-56  message flex flex-col p-2 bg-slate-50 w-fit rounded-md">
                    <small className='opacity-65 text-xs'>example@gmail.com</small>
                    <div className='text-sm' >

                    Lorem ipsum dolor sit amet.
                    </div>
                </div>
            </div>
            <div className="inputField w-full flex absolute bottom-0">
                        <input
                            value={message}
                            onChange={(e)=> setmessage(e.target.value)}
                            className='p-2 px-4 border-none outline-none flex-grow' type="text" placeholder='Enter message' />
                        <button
                            onClick={send}
                            className='px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
                    </div>
        </div>
        <div className= {`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
            <header className='flex justify-between items-center px-4 p-2 bg-slate-200'>
                <h1 className='font-semibold text-lg'>Collaborators</h1>
                <button onClick={() => setisSidePanelOpen(!isSidePanelOpen)} className='p-2'>
                    <i className="ri-close-fill"></i>
                </button>
            </header>
            <div className="users flex flex-col gap-2">

{project.users && project.users.map((user,key) => {


    return (
        <div key={key} className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center">
            <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                <i className="ri-user-fill absolute"></i>
            </div>
            <h1 className='font-semibold text-lg'>{user.email}</h1>
        </div>
    )


})}
</div>
        </div>
    </section>
    {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setisModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            
                            {users.map(user => (
                                
                                <div key={user._id} className={`user cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""} p-2 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
                )}
   </main>
   </>
  )
}

export default Project