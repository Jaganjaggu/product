import React, { useEffect, useState } from 'react'
import './ViewProducts.css'
import productimage from '../Assets/product.png'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import uploadimg from '../Assets/Upload-PNG.png'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addProductAPI, deleteAProductAPI, viewProductAPI } from '../Services/allAPI';
import { BASE_URL } from '../Services/baseURL';

function ViewProducts() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [filteredProducts,setFilteredProducts] = useState()
  const [initialProducts, setInitialProducts] = useState([]);
  // sorting
  const [sortOrder, setSortOrder] = useState('asc')
  // const [sortBy,setSortBy] = useState('Product Name')
  const [selectedOption, setSelectedOption] = useState('Filter');

  // search
  const [search, setSearch] = useState('')

  const [products, setProducts] = useState({
    productname: "", category: "", description: "", productimg: ""
  })
  const [preview, setPreview] = useState("")
  // console.log(products);

  const [viewAllProducts, setViewAllProducts] = useState([])

  const [showOptions, setShowOptions] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const handleViewAllProducts = async () => {
    const result = await viewProductAPI()
    setViewAllProducts(result.data)
  }

  console.log(viewAllProducts);

  useEffect(() => {
    setInitialProducts(viewAllProducts);
  }, [viewAllProducts]);

  console.log(initialProducts, "ll");


  useEffect(() => {
    handleViewAllProducts()
  }, [])

  const filteredProducts = viewAllProducts.filter((product) => (
    product.productname.toLowerCase().includes(search.toLowerCase())
  ))

  const handleResetFilters = () => {
    setViewAllProducts(initialProducts);
    setSortOrder('asc');
    setSelectedOption('Filter');
    setSearch('');
    handleViewAllProducts()
  };

  const handleOptionClick = (value) => {
    setSelectedOption(value);
    const sortProducts = [...filteredProducts].sort((a, b) => {
      const fieldA = value === 'Product Name' ? a.productname : a.category;
      const fieldB = value === 'Product Name' ? b.productname : b.category;
      const comparison = fieldA.localeCompare(fieldB);
      return sortOrder === 'asc' ? comparison : -comparison;
    })
    setViewAllProducts(sortProducts)
    setShowOptions(false)
  };

  const handleSortOrder = () => {
    handleOptionClick(selectedOption)
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'))
  }

  useEffect(() => {
    handleOptionClick(selectedOption);
  }, [sortOrder]);

  // modal____________________
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setPreview("")
    setProducts({
      productname: "", category: "", description: "", productimg: ""
    })
    setShow(false);
  }
  const handleShow = () => setShow(true);
  // Modal end____________________________

  const handleSubmit = async () => {
    const { productname, category, description, productimg } = products

    const textPattern = /^[A-Za-z\s]+$/;

    if (!productname.trim() || !category.trim() || !description.trim() || !productimg) {
      toast.warn('Please fill all the fields!', {
        // ... toast configuration ...
      });
      return;
    }

    if (!textPattern.test(productname.trim()) || !textPattern.test(category.trim()) || !textPattern.test(description.trim())) {
      toast.warn('Fields must contains character only', {
        // ... toast configuration ...
      });
      return;
    }


    if (!productname || !category || !description || !productimg) {
      toast.warn('Please fill the form completely!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      const reqBody = new FormData()
      reqBody.append("productname", productname)
      reqBody.append("category", category)
      reqBody.append("description", description)
      reqBody.append("productimg", productimg)

      const reqHeader = {
        "Content-Type": "multipart/form-data"
      }
      const result = await addProductAPI(reqBody, reqHeader)

      if (result.status === 200) {
        toast.success('Product Added', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        handleViewAllProducts()
        handleClose()
      }
    }
  }



  useEffect(() => {

  })

  useEffect(() => {
    if (products.productimg) {
      setPreview(URL.createObjectURL(products.productimg))
    }
  }, [products.productimg])
  // add image section

  const handleDelete = async (id) => {
    setShowDeleteModal(true);
    setProductsToDeleteId(id);
    // const result = await deleteAProductAPI(id)
    // console.log(result)
    // handleViewAllProducts()
  }



  const handleEdit = () => {

  }

  return (
    <>
      <div className='view-container'>
        <div className='view-header'>
          <h1>Choose Products</h1>
        </div>
        <div className='search-and-add'>
          <div className='view-search-products'>
            <input type="search" placeholder='Search' onChange={(e) => setSearch(e.target.value)} />
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <div onClick={handleShow} className='add-project'>
            <h5>Add Project</h5>
          </div>
        </div>
        <div onClick={() => setShowFilter(!showFilter)} className='show-filter'>
          <h3>SHOW FILTER</h3>
        </div>

        {showFilter && (
          <>
            <div className='filter-options'>
              <div>
                <h5>{filteredProducts.length} Items Found</h5>
              </div>

              <div className='filter-main'>
                <div className='sortAscDsc' onClick={handleSortOrder}>
                  <i class="fa-solid fa-caret-right fa-rotate-270"></i>
                  <i class="fa-solid fa-caret-right fa-rotate-90"></i>
                </div>
                <div className="sorting-tag">

                  <div className="custom-dropdown" >
                    <div className="selected-option" onClick={() => setShowOptions(!showOptions)}>
                      {selectedOption}

                    </div>
                    {showOptions && (
                      <ul className="dropdown-options">
                        <li onClick={() => handleOptionClick('Product Name')}>Product Name</li>
                        <li onClick={() => handleOptionClick('Category')}>Category</li>
                      </ul>
                    )}
                  </div>

                </div>
                <div className='reset-filters-button' onClick={handleResetFilters}>
                  <h6>Clear</h6>
                </div>
              </div>


            </div>


          </>

        )
        }
        <div className='product-list-container'>

          {filteredProducts?.map((item) => (
            <div className='product-card'>
              <div className='product-card-section1'>
                <div className='product-list-image'>
                  <img src={item ? `${BASE_URL}/uploads/${item?.productimg}` : productimage} alt="Image" />
                </div>
                <div className='product-list-content'>
                  <h2>{item.productname}</h2>
                  <h3>{item.category}</h3>
                  <div><p style={{ width: "100%", overflowWrap: 'break-word' }}>{item.description} </p></div>
                </div>
              </div>
              <div className='handleUpdate-container'>
                <div className='edit-product' onClick={() => handleEdit(item._id)}>

                  <i class="fa-solid fa-pen-to-square"></i>
                </div>
                <div className='delete-product' onClick={() => handleDelete(item._id)}>
                  <i class="fa-solid fa-trash"></i>
                </div>

              </div>


            </div>
          ))
          }


        </div>
        <>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='add-project-modal'>
                <label>
                  <input type="file" style={{ display: 'none' }} onChange={e => setProducts({ ...products, productimg: e.target.files[0] })} />
                  <div className='add-product-img'><img src={preview ? preview : uploadimg} alt="product_image" /></div>
                </label>
                <div className='add-product-fields'>
                  <input onChange={(e) => setProducts({ ...products, productname: e.target.value })} type="text" placeholder='Product Name' />
                  <input onChange={(e) => setProducts({ ...products, category: e.target.value })} type="text" placeholder='Category' />
                  <textarea onChange={(e) => setProducts({ ...products, description: e.target.value })} name="" id="" cols="30" rows="4" placeholder='Description'></textarea>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} variant="primary">Save</Button>
            </Modal.Footer>

          </Modal>
        </>

      </div>
      <ToastContainer />
    </>
  )
}

export default ViewProducts