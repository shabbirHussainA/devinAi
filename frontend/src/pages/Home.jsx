import React, { useEffect, useState } from 'react';
import projApi from '../apis/projApi';
import {useNavigate} from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
const [projects, setprojects] = useState([])

  useEffect(() => {
      projApi.getAll().then((res)=> setprojects(res.data.projects)).catch((err)=> console.log(err))
  }, [])
  
  const [openModal, setOpenModal] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleCreateProject = async() => {
    // Here you would handle the project creation logic, e.g., send a request to your backend
   await projApi.create(projectName).then((res)=> setprojects((prev)=>[...prev,res.data.newProject])).catch(err=>console.log(err))
    setOpenModal(false); // Close the modal
    setProjectName(''); // Clear the input field
  };

  return (
    <div className="p-4">
      <div className="project gap-2 flex flex-wrap">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Open Modal
          <i className="ri-links-line ml-2"></i> {/* Added margin for spacing */}
        </button>
        {
          projects.map((project,key)=>(
            <div onClick={()=> navigate(`/project`,{
              state:project //sending data through navigate
            })} className="bg-blue-500 hover:bg-blue-700  text-white font-bold py-2 px-4 rounded" key={key}>  <div>
        {project.name}
      </div>
      <div><i className="ri-user-line"></i>
      <p>Collaborators: 

        {project.users.length}
      </p>
      </div>
    </div>
          ))
        }
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="relative p-8 bg-white rounded-lg max-w-md w-full">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-lg font-medium mb-4">Create New Project</h2>
            <div className="mb-4">
              <label htmlFor="projectName" className="block text-gray-700 font-bold mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreateProject}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;