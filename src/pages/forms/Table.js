import React,{useState} from "react";
import pencil from './pencil.png'
import Trash from './trash.png'
export default function Table({UpdateRow, source , DeleteRow , Total }) {
  const [counter,setCounter]=useState(-5)
  const [text,setText] = useState('See more')
  const Toggle=()=>{
    if(counter==0) {
      setText('See more')
      setCounter(-5)
  }
  else if(counter==-5) {
    setText('See less')
    setCounter(0)
  }}
  return (
    <table class="table table-light table-striped">
      <thead>
        <tr>
          <th scope="col">No</th>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th scope="col">Count</th>
          <th scope="col">Price</th>
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        {source.slice(counter).reverse().map((row,idx)=>{
                    return  (<tr key={idx}>
                      <th scope="row">{row.id}</th>
                      <td>{row.name}</td>
                      <td>{row.category}</td>
                      <td>{row.count}</td>
                      <td>{row.price}</td>
                      <td>{row.total}</td>
                      <td style={{width:'6%'}}><button style={{border:'none'}}>
                        <img height={'100%'} width={'100%'} onClick={()=>DeleteRow(row.id)} src={Trash}/>
                      </button>
                      <button style={{border:'none'}} onClick={()=>UpdateRow(row)}>
                        <img height={'100%'} width={'100%'}  src={pencil}/>
                      </button></td>
                    </tr>);
                     })}                       
        <tr>
          <th scope="row"></th>
          <td colspan="2"></td>
          <td></td>
          <td class="fw-bold">Total Price :</td>
          <td class="fw-bold">{Total()} Afg</td>
        </tr>
        {source.length>=6 && <a onClick={Toggle} className="text-primary underlined text-center">{text}</a>}
      </tbody>
    </table>
  );
}
