import React, { useState, useEffect } from 'react'
import { Card, Typography, Image, Tag } from 'antd'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import createDOMPurify from 'dompurify'
import NavBar from './Navbar'
import Layout from './Layout'

function DetailPage() {
  const DOMPurify = createDOMPurify(window)
  const token = useSelector((state) => state.login.token)
  const history = useHistory()
  const [data, setData] = useState()
  const [isLoading, setIsloading] = useState(false)
  const { id } = useParams()

  function extractStringFromUrl(url) {
    const match = url.match(/\/([^\/]+)\./)
    if (match && match[1]) {
      return match[1]
    } else {
      return null
    }
  }

  function getListJob() {
    setIsloading(true)
    var myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(`http://localhost:5000/api/job/${id}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        setData(res)
        setIsloading(false)
      })
      .catch((error) => setIsloading(false))
  }

  useEffect(() => {
    getListJob()
  }, [])

  const Title = () => {
    return (
      <>
        <div style={{ display: 'flex' }}>
          <Tag color="magenta">{data.type}</Tag>
          <p style={{ margin: '0' }}> / {data.location} </p>
        </div>
        <Typography.Title>{data.title}</Typography.Title>
      </>
    )
  }
  return (
    <Layout>
      <NavBar />
      {data && (
        <Card title={<Title />} className="container">
          <div className="inner-container">
            <div className="desc">
              {
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(data.description),
                  }}
                />
              }
            </div>
            <div className="additional-info">
              <Card
                title={extractStringFromUrl(data.company_url)}
                className="small-box"
              >
                <Image src={data.company_logo} />
                <Typography.Link href={data.company_url}>
                  {data.company_url}
                </Typography.Link>
              </Card>
              <Card title="How to Apply" className="small-box">
                <Typography.Text>{data.how_to_apply}</Typography.Text>
              </Card>
            </div>
          </div>
        </Card>
      )}
    </Layout>
  )
}

export default DetailPage
