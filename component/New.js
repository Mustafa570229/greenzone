import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from '@/styles/New.module.css';
import axios from 'axios';

const New = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCollection, setNewCollection] = useState('');
  const [data, setData] = useState([]);
  const [valueOfCollections, setValueOfCollections] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState('');
  const [Name, setName] = useState('');
  const [collName, setCollName] = useState('');

  const [_id, set_id] = useState('');

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteItemId('');
  };

  const handleShowDeleteModal = (id, name,collName) => {
    setShowDeleteModal(true);
    setDeleteItemId(id);
    setName(name);
    setCollName(collName)
    
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/mydata?id=${deleteItemId}`);
      handleCloseDeleteModal();
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get('/api/mydata');
      setData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const saveData = async (e) => {
    e.preventDefault();
    const mydata = { newTitle, newContent, newCollection };
    if (_id) {
      //update
      await axios.put('/api/mydata', { ...mydata, _id });
    } else {
      //create
      await axios.post('/api/mydata', mydata);
    }

    try {
      setNewTitle('');
      setNewContent('');
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (_id) => {
    await axios.get(`/api/mydata?id=${_id}`).then((response) => {
      setNewTitle(response.data.newTitle);
      setNewContent(response.data.newContent);
      setNewCollection(response.data.newCollection);
      set_id(_id);
    });
  };

  return (
    <div className={styles.newsPanel}>
      <div className={styles.newsUploadPanel}>
        <Form onSubmit={saveData}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className={styles.addingHeadPanel}>Enter collection</Form.Label>
            <Form.Control
              type="text"
              className="mb-5"
              placeholder="Collection Name"
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
            />

            <Form.Label className={styles.addingHeadPanel}>Enter a new Title</Form.Label>
            <Form.Control
              type="text"
              className="mb-5"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <Form.Label className={styles.addingHeadPanel}>Enter a new Content</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </Form.Group>
          <div>
            <Button variant="primary" type="submit" className="mb-3">
              Save Data
            </Button>
          </div>
        </Form>
      </div>
      <div className={styles.panelShowing}>
        <Form.Select
          style={{ marginBottom: '20px' }}
          aria-label="Default select example"
          value={valueOfCollections}
          onChange={(e) => setValueOfCollections(e.target.value)}
        >
          <option value="">Select a Collection</option>
          {data
            .reduce((uniqueCollections, coll) => {
              if (!uniqueCollections.includes(coll.newCollection)) {
                uniqueCollections.push(coll.newCollection);
              }
              return uniqueCollections;
            }, [])
            .map((collection) => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
        </Form.Select>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((el) => el.newCollection === valueOfCollections)
              .map((el) => (
                <tr key={el._id}>
                  <td style={{color:"gray"}}>{el.newTitle}</td>
                  <td className={styles.deleteAndEdit}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => handleShowDeleteModal(el._id, el.newTitle,el.newCollection)}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      style={{ width: '25px', color: 'red', cursor: 'pointer', marginRight: '10px' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Do you really want to delete{' '}
                        <span style={{ color: '#f55', fontWeight: 'bold', margin: '3px' }}>{Name}</span>
                        from <span style={{color:"blue",fontWeight: 'bold', margin: '3px'}}>{collName}</span>?
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteModal}>
                          Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                          Delete
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: '25px', color: 'blue', cursor: 'pointer' }}
                      onClick={() => handleEdit(el._id)}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default New;