import React from 'react'
import {Link} from 'react-router-dom';
import Slider from '../components/Slider';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'

function Explore() {
  return (
    <div className='exlore'>

      <header>

        <p className='pageHeader'>Explore</p>
      </header>

      <main>
        


        <p className='exploreCategoryHeading'>Categories</p>

        <div className='exploreCategories'>
          <Link to='/category/rent'>
            <img src={rentCategoryImage} alt="rent" className='exploreCategoryImg' />
            <p className='exploreCategoryName'>Places For Rent

            </p>
          </Link>
          <Link to='/category/sale'>
            <img src={sellCategoryImage} alt="sell" className='exploreCategoryImg' />
            <p className='exploreCategoryName'>Places For Sale

            </p>
          
          </Link>


        </div>

      </main>
    </div>
  )
}

export default Explore