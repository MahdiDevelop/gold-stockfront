import React,{useState,useEffect} from 'react'
export default function Category({defaultValue,handleAdd,increment,setIncrement}) {

  const [formstate,setFormstate]=useState(
      defaultValue
  )

  const calculateTotal12 = () => {
    console.log(defaultValue);
    let total1 = 0;
    total1 =formstate.count * formstate.price;
    return total1;
  }; 

  const [errors, setErrors]=useState('')

  const validation =()=>{
    if(formstate.name==='' || formstate.count==='' || formstate.price==='' || formstate.category===''){
      let errorFields=[];
      for(const [key, value] of Object.entries(formstate)){
          if(!value && key!=='total'){
              errorFields.push(key)
          }
      }
      setErrors(errorFields.join(', '))
      return false;
    }
    else{
      return true;
    }
  }
  
  const submit = () => {
    if(validation()){
      handleAdd(formstate);
      setFormstate({
        id:0,
        name:'',
        count:0,
        price:0,
        category:'',
        total:0,
        })
    }
  };

  const handleName=(e)=>{
    setFormstate({
     ...formstate,
        name:e.target.value
    })
}  
const handleCount=(e)=>{
  setFormstate({
   ...formstate,
      count:e.target.value
  })
}  
const handlePrice=(e)=>{
  setFormstate({
   ...formstate,
      price:e.target.value
  })  
}  
const handleCategory=(e)=>{
  setFormstate({
   ...formstate,
      category:e.target.value
  })
}  
    return (
    <div>< form
    class="row rounded-3 m-2 bg-white"
    // style={{ background: "#bdd6ef" }}
  >
    <div className="row">
      <div className="col"></div>
    </div>
    <div class="col-2 m-2 mt-3 ps-3 p-0 ms-2">
      <label for="">Name</label>
      <input
        value={formstate.name}
        onChange={handleName}
        type="text"
        name="name"
        placeholder="Name"
        class="form-control h-auto"
      />
    </div>
    <div class="col-2 m-2 mt-3 ps-3 p-0">
      <label for="">Count</label>
      <input
        onChange={handleCount}
        min={1}
        max={1000}
        value={formstate.count}
        type="number"
        placeholder="Count"
        class="form-control h-auto"
      />
    </div>
    <div class="col-1 m-2 mb-3 mt-3 p-0">
      <label for="">Price</label>
      <input
        onChange={handlePrice}
        value={formstate.price}
        type="text"
        placeholder="Price"
        class="form-control h-auto"
      />
    </div>
    <div class="col-1 m-2 mb-3 mt-3 p-0">
      <label for="">Total</label>
      <input
        value={calculateTotal12()}
        name='total'       
        readOnly="true"
        type="text"
        placeholder="Total"
        class="form-control h-auto"
      />
    </div>
    <div class="col-3 m-0 mt-3">
      <label for="">Category</label>
      <select name="" id="" value={formstate.category} onChange={handleCategory} class="form-select">
        <option class="p-1" selected>
          Category
        </option>
        <option selected value={'Periodontincs'}>Periodontincs</option>
        <option selected value={'Prosthodontics'}>Prosthodontics</option>
        <option selected value={'Oral Surgery'}>Oral Surgery</option>
        <option selected value={'Operative Dentistry'}>Operative Dentistry</option>
        <option selected value={'Dental Implants'}>Dental Implants</option>
        <option selected value={'Orthodontics'}>Orthodontics</option>
      </select>
    </div>
    <div
      class="col-1 m-0 mb-3 mt-3 mx-0 p-0"
      style={{ width: "5vw" }}
      >
 
      <button
        type="button"
        class="btn btn-secondary mx-lg-5 my-lg-3 h-75 w-100 bg-dark"
        onClick={()=>submit()}
        > 
        ADD
      </button>
    </div>
        {errors && <div className='bg-danger text-bg-secondary w-50 rounded pt-1 pb-1 ms-2'>Please include {errors}</div>}

  </form></div>
  )
}