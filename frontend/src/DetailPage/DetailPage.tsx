import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router';
import Layout from '../Layout';
import { Tabs ,Carousel, Button, Image, Descriptions , Col, Row, Tag} from 'antd';
import type { TabsProps } from 'antd';
import './DetailPage.css'



const DetailPage = () => {

    const param = useParams();
    const [data, setData] = useState<undefined | any>(undefined);
   
    useEffect(() => {
      fetch("http://localhost:9090/v1/game/" + param.gameid)
        .then(response => response.json())
        .then(response => setData(response.game))
       //.then(response => alert(JSON.stringify(response)))
        .catch(error => alert("Erreur : " + error));
  }, [param])
  

    const items: TabsProps['items'] = [
      {
        key: '1',
        label: `Windows`,
        children: data?.pc_requirements && Object.keys(data.pc_requirements).map((keyName, i) => (
          <p dangerouslySetInnerHTML={{ __html: data?.pc_requirements[keyName] }}/>
        )),
      },
      {
        key: '2',
        label: `macOs`,
        children: data?.mac_requirements && Object.keys(data.mac_requirements).map((keyName, i) => (
          <p dangerouslySetInnerHTML={{ __html: data?.mac_requirements[keyName] }}/>

        )),
      },
      {
        key: '3',
        label: `Linux`,
        children: data?.linux_requirements && Object.keys(data.linux_requirements).map((keyName, i) => (
          <p dangerouslySetInnerHTML={{ __html: data?.linux_requirements[keyName] }}/>
  
        )),
      },
    ];


    return (
        <div >
          <Layout/>
          <Row align="middle">
            <Col xs={24} sm={24} md={24} lg={12} xl={14} ><h1>{data?.name}</h1></Col>
            <Col xs={24} sm={24} md={24} lg={6} xl={8} >
              <Button href={data?.support_url} size={'large'}>Community hub</Button>
            </Col>
          </Row>

          <Row align="middle" >
            <Col xs={24} sm={24} md={24} lg={14} xl={15} >
              
            <Carousel autoplay effect="fade" autoplaySpeed={6000}>
              {data?.movies && Object.keys(data.movies).map((_id) => (
                <div className="container">
                  <iframe src={data?.movies[_id].webm.max} allowFullScreen></iframe>
                </div>
              ))}
               
              {data?.screenshots && Object.keys(data.screenshots).map((_id) => (
                
                <div className="container">
                  
                  <Image src={data?.screenshots[_id].path_full} />
                </div>
              ))}
            </Carousel>
            
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={9} >
              <Descriptions title= {<p className="container"><Image preview ={false}  src={data?.header_image}/></p>} column={1}>
                <Descriptions.Item >{data?.short_description}</Descriptions.Item>
                <Descriptions.Item label="Positive Ratings">{data?.positive_ratings}</Descriptions.Item>
                <Descriptions.Item label="Negative Ratings">{data?.negative_ratings}</Descriptions.Item>
                <Descriptions.Item label="Release Date">{data?.release_date}</Descriptions.Item>
                <Descriptions.Item label="Developer">{data?.developer}</Descriptions.Item>
                <Descriptions.Item label="Publisher">{data?.publisher}</Descriptions.Item>
                <Descriptions.Item label="">
                {data?.steamspy_tags && Object.keys(data.steamspy_tags).map((keyName, i) => (
                  <Tag key={i}>{data?.steamspy_tags[keyName]}</Tag>
                ))}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>

          <Row align="middle" >
            <Col span={24} > 
            <hr/>
            <div className="addGame">
              <h2>You like this game? </h2>
              
              <h4>Add it to your library</h4>
              <Button href="#" size={'large'}>Add</Button>
            </div>
            <hr/>
            </Col>
          </Row>

          <Row>
            <Col  xs={{ span: 24 , order: 2 }} sm={{ span: 24 , order: 2 }} 
            md={{ span: 24 , order: 2 }} lg={{ span: 14 , order: 1 }} xl={{ span: 15 , order: 1 }} >

              <h2>About the game</h2>
              <hr/>
              <p dangerouslySetInnerHTML={{ __html: data?.about_the_game }}/>

              <h2>Requirement</h2>
              <hr/>
              <Tabs defaultActiveKey="1" items={items} />

            </Col>

            <Col  xs={{ span: 24 , order: 1 }} sm={{ span: 24 , order: 1 }}
             md={{ span: 24 , order: 1 }} lg={{ span: 8 , order: 2 }} xl={{ span: 9 , order: 2 }}>
            <Descriptions title= "Other Information" column={1}>
                <Descriptions.Item label="Genres">
                  {data?.genres && Object.keys(data.genres).map((keyName, i) => (
                    data?.genres[keyName] + " "
                  ))}
                </Descriptions.Item>
                <Descriptions.Item label="Categories">
                  {data?.categories && Object.keys(data.categories).map((keyName, i) => (
                      data?.categories[keyName] + " | "
                    ))}
                </Descriptions.Item>
                <Descriptions.Item label="Platforms">
                    {data?.platforms && Object.keys(data.platforms).map((keyName, i) => (
                      <Tag key={i}>{data?.platforms[keyName]}</Tag>
                    ))}
                </Descriptions.Item>
               
              </Descriptions>
              
              <Descriptions title= "" column={1}>
                <Descriptions.Item label="Price">{data?.price} $</Descriptions.Item>
                <Descriptions.Item label="Required Age">{data?.required_age}</Descriptions.Item>
                <Descriptions.Item label="Achievements">{data?.achievements}</Descriptions.Item>
              </Descriptions>

            </Col>
          </Row>
          

        </div>
    );
};

export default DetailPage;
