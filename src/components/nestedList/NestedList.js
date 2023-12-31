import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import './NestedList.css';
import axios from "axios";

const NestedList = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);

  const handleCategoryExpand = (index) => {
    const updatedCategories = categories.map((item, i) => {
      if (i === index) {
        return { ...item, showSubList: !item.showSubList };
      } else {
        return { ...item, showSubList: false };
      }
    });
    setCategories(updatedCategories);
  };

  useEffect(() => { 
    axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URL}/categories`).then((data) => {
      const categories = data.data.map((item) => { 
        return {
          categoryid: item._id,
          categoryname: item.categoryname,
          showSubList: false,
          subcategories: item.subcategories,
        }
      })
      setCategories(categories)
    }).catch((error) => {
      console.log(error);
    })
  }, [])


  return (
    <ul className="space-y-2 h-[12rem] overflow-scroll mt-2 scrollbar-hide px-2">
      {categories && categories.map((item, index) => (
        <li className="hover:text-[#1D6F2B]" key={index} >
          <span className='text-black' onClick={() => { 
            onCategorySelect(
              { categoryname: item.categoryname, categoryId: item.categoryid },
              { subcategoryname: null, subcategoryId: null })
        }}>{item.categoryname}</span>
          {item.subcategories && item.subcategories.length > 0 ? 
            <FontAwesomeIcon className="float-right h-3 mt-1" icon={faAngleRight} style={{ color: "#000000", }} onClick={() => handleCategoryExpand(index)} /> : ""
          }
          {item.showSubList && item.subcategories.length > 0 && (
            <div className={`absolute top-0 left-[17.5rem]  flex w-[20rem] ${item.showSubList ? 'fade-in' : 'fade-out'}`}>
              <div className="w-full">
                <ul className="w-full space-y-2 p-2 shadow bg-white rounded-md border border-gray-100">
                  {item.subcategories.map((subItem, subIndex) => (
                    <li className="text-black hover:text-[#1D6F2B]" key={subIndex} onClick={() => { 
                      onCategorySelect(
                        { categoryname: null, categoryId: null },
                        { subcategoryname: subItem.subcategoryname, subcategoryId: subItem._id })
                    }}>{subItem.subcategoryname}</li>
                  ))}
                </ul>
              </div>
              <div className="w-1/3">
                {/* Additional content for sub-category */}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NestedList;
