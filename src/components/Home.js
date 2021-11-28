import '../App.css';
import { Navbar,Container,Button,Form ,Alert,Spinner} from 'react-bootstrap';
import React, { useState } from 'react';
function Home(){
const [url, setUrl] = useState("http://google.com");
const [genurl, setGenurl] = useState("");
const [isAlert,setIsAlert]=useState(false);
const [flag,setFlag]=useState(false);
const validURL=function(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}
const getUrl=(url)=>{
    let err=false;
  const valid=validURL(url);
  if(valid){
  setGenurl("");
  setFlag(true);
  fetch("https://srt-urls.herokuapp.com/getUrl",{
    // fetch("http://localhost:3009/getUrl",{
      method: "POST",
      body: JSON.stringify({
         url
      }),
      headers: {
         "Content-Type": "application/json",
        //  "Access-Control-Allow-Origin":true
      },
    //   mode:"no-cors" 
    }).then(
      (r) => {
      setFlag(false);

         console.log(r);
         if (r.ok) {
          setGenurl("");
          // alert("success!!!!")
          return r.json();
         } else {
             err=true;
           console.log(r);
          alert("Failed to generate short link!");
         }
      }
   ).then((r)=>{
       if(!err){
    console.log(r.url);
    setGenurl(r.url);
       }
   });
  }else{
    alert("Please enter a valid URL!");
  }
}
const copyToClipboard=function(){
  navigator.clipboard.writeText(genurl);
  setIsAlert(true);
  setTimeout(()=>{
    setIsAlert(false);
  },1000)
}
    return (
        <div>
            
            <Navbar bg="dark" variant="dark">
                <Container>
                <Navbar.Brand href="#">Short Url </Navbar.Brand>
                    
                </Container>
            </Navbar>
            <div className="containers">
            <Form>
  

  <Form.Group className="mb-3 field1" controlId="formBasicurl">
    <Form.Label>Enter your URL</Form.Label>
    <div className="clear">
    <Form.Control type="text" value={url} placeholder="Paste your url" onChange={(e)=>{
        setUrl(e.target.value);
    }} />
   
    <Button variant="outline-danger" onClick={()=>{
      setUrl("");
      setGenurl("");
    }}>x</Button>
    </div>
  </Form.Group>
  {
      flag?<Button variant="dark" disabled>
      <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
      />
      Genearting...
    </Button>:<Button variant="primary" type="button" onClick={()=>{
      getUrl(url);
  }}>
    Submit
  </Button>
    }
  
  <Form.Group className="mb-3 field2" controlId="genurl">
    <Form.Label>Generated sort URL {" "}</Form.Label>
    {(genurl!=="" && genurl!==null && genurl!==undefined)?<Button type="button" variant="outline-primary" href={genurl} target="_blank"  >{genurl}</Button>:null}
    
  </Form.Group>
  
</Form>
{!isAlert?<Button  variant="outline-warning" type="button" onClick={()=>{
      copyToClipboard();
  }}>
    copy to clipboard
  </Button>:null}
  {isAlert?<Alert key={123} variant="info">
    Link successfully copied to clipboard!!!
  </Alert>:null}
            </div>
        </div>
    )
}
export default Home;