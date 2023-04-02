import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router';
import Layout from '../Layout';


const DetailPage = () => {

    const param = useParams();
    const [data, setData] = useState<undefined | any>(undefined);
    
    useEffect(() => {
      console.log(param);
      fetch("http://localhost:9090/v1/game/10")
        .then(response => response.json())
        .then(response => setData(response))
       //.then(response => alert(JSON.stringify(response)))
        .catch(error => alert("Erreur : " + error));
  }, [param])
   
    // fetch("http://localhost:9090/v1/game/" + param)
    //     .then(response => response.json())
    //     .then(response => alert(JSON.stringify(response.appid)))
    //     .catch(error => alert("Erreur : " + error));

    return (
        <div >
          <Layout/>
          <h1>{data?.name}</h1>
        </div>
    );
};

export default DetailPage;
