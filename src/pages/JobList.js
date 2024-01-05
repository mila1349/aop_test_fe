import React, { useState, useEffect } from 'react'
import {
  Avatar,
  Input,
  List,
  Skeleton,
  Typography,
  Button,
  Checkbox,
} from 'antd'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import NavBar from './Navbar'
import Layout from './Layout'
import { parseISO, formatDistanceToNow } from 'date-fns';

function JobList() {
  const token = useSelector((state) => state.login.token)
  const history = useHistory()
  const [initLoading, setInitLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [params, setParams] = useState({})

  const getFirstSentence = (paragraph) => {
    const firstSentence = paragraph.match(/^.*?[.!?]/)
    if (firstSentence) {
      return firstSentence[0]
    } else {
      return ''
    }
  }

  const formatTimestamp = (timestamp) => {
    const parsedTimestamp = parseISO(timestamp);
    const distance = formatDistanceToNow(parsedTimestamp, { addSuffix: true });
    return distance;
  };

  function getListJob() {
    setList([])
    setInitLoading(true)

    var myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    const queryString = new URLSearchParams(params).toString()
    console.log('bvgfyhjmqueryString', queryString)

    fetch(`http://localhost:5000/api/job?${queryString}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        setList(res)
        setLoading(false)
        setInitLoading(false)
      })
      .catch((error) => setInitLoading(false))
  }

  useEffect(() => {
    getListJob()
  }, [])

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      ></div>
    ) : null
  return (
    <Layout>
      <NavBar />
      <div className="list">
        <Typography.Title>Job List</Typography.Title>
        <div className="search-bar">
          <div>
            <Typography.Text>Job Description</Typography.Text>
            <Input
              placeholder="Search desscription"
              onChange={(e) =>
                setParams({ ...params, ['description']: e.target.value })
              }
            />
          </div>
          <div>
            <Typography.Text>Job Location</Typography.Text>
            <Input
              placeholder="Search Location"
              onChange={(e) =>
                setParams({ ...params, ['location']: e.target.value })
              }
            />
          </div>
          <div>
            <Checkbox
              onChange={(e) =>
                setParams({ ...params, ['full-time']: e.target.checked })
              }
            >
              Full Time Only
            </Checkbox>
          </div>
          <Button
            type="primary"
            style={{ margin: 0 }}
            onClick={() => getListJob()}
          >
            Search
          </Button>
        </div>
        <List
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          className="list-items"
          renderItem={(item) => (
            <List.Item
              onClick={() => history.push(`/jobdetail/${item.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Skeleton avatar title={false} active loading={initLoading}>
                <List.Item.Meta
                  title={item.title}
                  description={`${getFirstSentence(item.description)} - ${item.type}`}
                />
                <List.Item.Meta
                  title={item.location}
                  description={formatTimestamp(item.created_at)}
                  style={{ textAlign: 'right' }}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    </Layout>
  )
}

export default JobList
