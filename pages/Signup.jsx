import React from 'react'
import {useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import {getAuth,createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
import {db} from '../firebase.config'
import { setDoc ,doc,serverTimestamp } from 'firebase/firestore'
import OAuth from '../components/OAuth'
import {ReactComponent as ArrowRightIcon}  from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
 
function Signup() {

  const [showPassword,setShowPassword]=useState(false)

  const [formData,setFormData]=useState({
    name:'',
    email:'',
    password:''})


    const {email,password,name}=formData

    const navigate=useNavigate()



    const onChange =(e) =>{

      setFormData((prevState) =>({
        ...prevState,
        [e.target.id]:e.target.value

      }))
    }


    const onsubmit = async (e)=>{
      e.preventDefault()

      try{
        const auth=getAuth()
        const userCredential=await createUserWithEmailAndPassword(auth,email,password)


        const user=userCredential.user


        updateProfile(auth.currentUser,{
          displayName:name
        })


        const formDataCopy={...formData}
         delete formDataCopy.password
         formDataCopy.timestamp=serverTimestamp()

         await setDoc(doc(db,'users',user.uid),formDataCopy)
        navigate('/')


      }catch (error) {
        toast.error('Cannot register.Please try again')
        
      }

    }
  return (
    <>
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Welcome Back</p>
      </header>
      
        <form onSubmit={onsubmit}>
        <input type="text" className='nameInput' placeholder="please enter your fullname" id="name" value={name} onChange={onChange}/>
          <input type="email" className='emailInput' placeholder="please enter your email" id="email" value={email} onChange={onChange}/>
          <div className='passwordInputDiv'>
          <input type={showPassword ? 'text' :'password'} className='passwordInput' placeholder="please enter your password" id="password" value={password} onChange={onChange}/>
          <img src={visibilityIcon} alt='show' className='showPassword' onClick= { () => setShowPassword((prevState)=> !prevState)}/>
          </div>
          <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password</Link> 
        <div className='signUpBar'>
        <p className='signUpText'>Sign-Up</p>
        <button className='signUpButton' >
          <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/> 
        </button>

        </div>
        <Link to ='/sign-in' className='registerLink'> have account Sign-in </Link> 


        </form>
        <OAuth/>


     


     
    </div>


    </>
  )
}

export default Signup