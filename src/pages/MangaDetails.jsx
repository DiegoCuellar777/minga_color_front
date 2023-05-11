import axios from 'axios'
import { Link as Anchor, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from 'react'
import apiUrl from '../../api.js'
import { useSelector, useDispatch } from 'react-redux'
import mangasActions from '../redux/actions/mangas'

export default function MangaDetails() {
  const { readOneManga } = mangasActions
  const store = useSelector(store => console.log('STORE ', store))
  let token = localStorage.getItem('token')
  let headers = {headers:{'Authorization':`Bearer ${token}`}}
  const dispatch = useDispatch()
  let manga_id = '6453ed47cf3118bcb0e205a8'
  let [img, setImg] = useState()
  let [title, setTitle] = useState('')
  let [details, setDetails] = useState('')
  let [authorIp, setAuthorIp] = useState()
  let [categoryId, setCategoryId] = useState()
  let [nameAuthor, setnameAthor] = useState('')
  let [lastAuthor, setlastAthor] = useState('')
  let [category, setCategory] = useState('')
  let [photo, setPhoto] = useState('')
  useEffect(
    () => {
      axios(apiUrl + `mangas/${manga_id}`)
        .then(res => {
          setImg(res.data.response.cover_photo)
          setTitle(res.data.response.title)
          setDetails(res.data.response.description)
          setAuthorIp(res.data.response.author_id)
          setCategoryId(res.data.response.category_id)
          dispatch(readOneManga({
            cover_photo: res.data.response.cover_photo,
            title: res.data.response.title,
            manga_id: manga_id
          }))
        })
        .catch(err => console.log(err))
    },
    []
  )
  useEffect(
    () => {
      axios(apiUrl + `api/authors/${authorIp}`,headers)
        .then(res => {
          setnameAthor(res.data.response?.name)
          setlastAthor(res.data.response?.last_name)
          setPhoto(res.data.response.photo)
          console.log(authorIp)
        })
        .catch(err => console.log(err))
    },
    [authorIp]
  )

  useEffect(
    () => {
      axios(apiUrl + `categories`)
        .then(res => {
          let ca = res.data.categories
          let category = ca.find(category => {
            if (category._id == categoryId) {
              return category.name
            }
          })
          console.log('Esta Wea ', category)
          setCategory(category.name)
        })
        .catch(err => console.log(err))
    },
    [categoryId]
  )

  return (
    <>

      <div>
        <img className='w-[602px] h-[736px]' src={img} alt="" />
      </div>
      <div className='xl:w-[482px] lg:w-[350px] relative h-auto'>
        <div className='absolute left-0 top-0 xl:w-[472px] lg:w-[350px] h-[335px] bg-gradient-to-r from-[#4338CA] to-[#5E52F3] blur-[304px] rounded-full'></div>
        <div className='flex-none flex-col items-center break-words'>
          <div className='flex justify-between text-white'>
            <p>{category}</p>
            <Anchor to={`/authors/${authorIp}`} className='flex'><img className='w-[30px] p-1' src={photo} alt="" /> {nameAuthor} {lastAuthor}</Anchor>
          </div>
          <h3 className='flex items-center tracking-wider leading-[140%] font-semibold w-auto text-white text-left xl:text-[48px] lg:text-[35px]'>
            {title}
          </h3>
          <p className='mt-5 flex items-center tracking-wider leading-[120%] font-normal not-italic w-auto text-white text-left xl:text-[16px] lg:text-[15px]'>
            {details}
          </p>
        </div>
        <Anchor img={img} to={'/chapters/get'} className="flex justify-center mt-5  rounded-[5px] text-gray-500 bg-gradient-to-r from-[#4338CA] to-[#5E52F3]  xl:text-[16px] lg:text-[15px]">Read Now</Anchor>
      </div>
    </>
  )
}
