import React, {useState, useEffect} from 'react';
import Stack from '@mui/material/Stack';
import { TextField, Button } from "@mui/material";
import { makeStyles } from '@mui/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


const useStyles = makeStyles({
  form: {
    width: '15%',
  },
});


export default function Home() {

  const classes = useStyles();

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [address, setAddress] = useState('');
  const [birth, setBirth] = useState(dayjs(new Date()));
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [imagefile, setImagefile] = useState(null);
  const [idupdate, setIdupdate] = useState(0);

  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);


  const [dataws, setDataws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const ENDPOINT_URL=process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    loadPeoples();
   }, []);


  const handleChangeName = (value) => {
    setName(value);
  };

  const loadPeoples = () => {
    fetch(ENDPOINT_URL+"people/")
    .then((response) => response.json())
    .then((data) => {
      if(data.length>0)
      {
        setDataws(data);
      }
      else
        setDataws([]);
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  const handleChangeLastName = (value) => {
    setLastname(value);
  };

  const handleChangeAddress = (value) => {
    setAddress(value);
  };

  const handleChangePhone = (value) => {
    setPhone(value);
  };

  const handleChangeFrom = (value) => {
    setFrom(value);
  };

  const handleChangeTo = (value) => {
    setTo(value);
  };

  const handleFileUpload = (file) => {
    
    setImagefile(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const loadfile = (file) => {

    setImagefile(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleClickInsertar = () => {
  
    const formdata = new FormData();
    formdata.append('name',name);
    formdata.append('lastname',lastname);
    formdata.append('address',address);
    formdata.append('birth',birth);
    formdata.append('phone',phone);
    formdata.append('photo',imagefile);
    const requestOptions = {
      method: 'POST',
      body: formdata
  };
    fetch(ENDPOINT_URL+"people/create", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if(data.id)
          {
            alert('successfully created person');
            loadPeoples();
            cleanfields();
          }
            
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    
  };

  const handleClickDelete = (id) => {
    const requestOptions = {
      method: 'DELETE'
  };
    fetch(ENDPOINT_URL+"people/delete/"+id, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if(data.result=='Deleted Successfully')
          {
            alert('Deleted Successfully');
            loadPeoples();
          }
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    
  };

  const handleClickEdit = (id) => {
    const index = dataws.findIndex(object => {
      return object.id === id;
    });
    setIdupdate(id);
    setName(dataws[index].name);
    setLastname(dataws[index].lastname);
    setAddress(dataws[index].address);
    setBirth(dayjs(new Date(dataws[index].birth)));
    setPhone(dataws[index].phone);

    fetch(ENDPOINT_URL+"people/peoplephoto/"+id)
    .then((response) => response.blob())
    .then((data) => {
      setImage(URL.createObjectURL(data));

    })
    .catch((err) => {
      //setError(err);
    })
    .finally(() => {
      setLoading(false);
    });
    
  };

  const handleClickUpdate = () => {
    const formdata = new FormData();
    formdata.append('name',name);
    formdata.append('lastname',lastname);
    formdata.append('address',address);
    formdata.append('birth',birth);
    formdata.append('phone',phone);
    formdata.append('photo',imagefile);
    const requestOptions = {
      method: 'PUT',
      body: formdata
  };

    fetch(ENDPOINT_URL+"people/update/"+idupdate, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if(data.id)
          {
            alert('successfully updated person');
            loadPeoples();
            setIdupdate(0);
            cleanfields();
          }
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    
  };

  const handleClickCancel = () => {
    setIdupdate(0);
    cleanfields();
    
  };

  const handleFindNameAddress = () => {
    const formdata = new FormData();
    formdata.append('name',name);
    formdata.append('address',address);
    const requestOptions = {
      method: 'POST',
      body: formdata
  };

    fetch(ENDPOINT_URL+"people/SearchByNameAndAddress", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if(data.length>0)
            {
              setDataws(data);
            }
            else
              setDataws([]);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    
  };

  const handleFindRange = () => {
    const formdata = new FormData();
    formdata.append('from',from);
    formdata.append('to',to);
    const requestOptions = {
      method: 'POST',
      body: formdata

      }

    fetch(ENDPOINT_URL+"people/SearchByRangeAge", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if(data.length>0)
            {
              setDataws(data);
            }
            else
              setDataws([]);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    
  };

  const cleanfields = () => {
    setName('');
    setLastname('');
    setAddress('');
    setBirth(dayjs(new Date()));
    setPhone('');
    setImage(null);
    setImagefile(null);
  }

  return (
    <div>
        <Box sx={{ flexGrow: 1, marginBottom: '40px' }}>
          <AppBar position="static">
          <Toolbar>
          </Toolbar>
          </AppBar>
        </Box>
        <Stack direction="column" spacing={2} justifyContent="center"
        alignItems="center">
          {loading && <div>A moment please...</div>}
          {error && (
            <div>{`There is a problem fetching the data - ${error}`}</div>
          )}
          <TextField 
            id="name" 
            type="text"
            value={name}
            InputLabelProps={{
              shrink: true,
            }} 
            label="Name" 
            required
            className={classes.form}
            onChange={(e) => handleChangeName(e.target.value)}
          />
          <TextField 
            id="lastname" 
            type="text"
            value={lastname}
            InputLabelProps={{
              shrink: true,
            }} 
            label="Lastname" 
            required
            className={classes.form}
            onChange={(e) => handleChangeLastName(e.target.value)}
          />
          <TextField 
            id="address" 
            type="text"
            value={address}
            InputLabelProps={{
              shrink: true,
            }} 
            label="Address" 
            required
            className={classes.form}
            onChange={(e) => handleChangeAddress(e.target.value)}
          />
          <DatePicker value={birth} onChange={(newValue) => setBirth(newValue)}/>
          <TextField 
            id="phone" 
            type="number"
            value={phone}
            InputLabelProps={{
              shrink: true,
            }} 
            label="Phone" 
            required
            className={classes.form}
            onChange={(e) => handleChangePhone(e.target.value)}
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            <label htmlFor="upload-image">
              <Button variant="contained" component="span">
                Upload
              </Button>
              <input
                id="upload-image"
                hidden
                accept="image/*"
                type="file"
                onChange={(event)=>handleFileUpload(event.target.files[0])}
              />
            </label>
            {image && <img src={image} alt="Uploaded Image" height="150" />}
          </Stack>
          
            {
            !idupdate?
            <Button variant="contained" onClick={handleClickInsertar}>Insert</Button>
            :
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button variant="contained" onClick={handleClickUpdate} >Update</Button>
              <Button variant="contained" onClick={handleClickCancel} >Cancel</Button>
            </Stack>
            }
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <TextField 
            id="from" 
            type="number"
            value={from}
            InputLabelProps={{
              shrink: true,
            }} 
            label="from" 
            className={classes.form}
            onChange={(e) => handleChangeFrom(e.target.value)}
          />
          <TextField 
            id="to" 
            type="number"
            value={to}
            InputLabelProps={{
              shrink: true,
            }} 
            label="to" 
            className={classes.form}
            onChange={(e) => handleChangeTo(e.target.value)}
          />
          </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button variant="contained" onClick={handleFindRange} >Find By Range</Button>
              <Button variant="contained" onClick={handleFindNameAddress} >Find By Name and Address</Button>
            </Stack>

          {
           dataws.length>0? <TableContainer component={Paper} style={{ marginBottom: '50px', width: '50%' }}>
            <Table sx={{ minWidth: 250 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Lastname</TableCell>
                  <TableCell align="center">Birth</TableCell>
                  <TableCell align="center">Phone</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataws.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.lastname}</TableCell>
                    <TableCell align="center">{row.birth.split("T")[0]}</TableCell>
                    <TableCell align="center">{row.phone}</TableCell>
                    <TableCell align="center">
                      <IconButton aria-label="Delete" onClick={()=>handleClickDelete(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton aria-label="Edit" onClick={()=>handleClickEdit(row.id)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>:''
          }
        </Stack>
        </div>
  );
}