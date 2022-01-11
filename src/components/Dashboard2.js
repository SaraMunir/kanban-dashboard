import React, {useEffect, useState, useRef} from 'react'
import './Styles/general.css';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../firebase';

function Dashboard() {
    const [userId, setUserId]=useState('')
    const [showModal, setShowModal]=useState(false)
    const [isOffline, setIsOffline]=useState(false)
    const [showAddLaneForm, setShowAddLaneForm]=useState(false)
    const [showAddCardForm, setShowAddCardForm]=useState(false)
    const [laneInput, setLaneInput]=useState({laneTittle: ''})
    const [cardInput, setCardInput]=useState({cardTittle: '', cardType: 'Bug', laneId: ''});
    const [alert, setAlert] = useState({show: false, alertText: ''})
    const inputLaneTittle = useRef();
    const [allLanes, setAllLanes]=useState([]);
    window.addEventListener('offline', function(e) { 
        console.log('offline');
        setIsOffline(true)
    });

// 
    const addLane=(e)=>{
        const laneId = uuidv4()
        e.preventDefault()
        if(laneInput.laneTittle===''){
            inputLaneTittle.current.focus();
            setAlert({show:true, alertText:'Please provide title of Lane'})
        }
        console.log(laneInput)
        const laneObject ={
            laneId: laneId,
            laneTittle: laneInput.laneTittle
        }
        // console.log(laneObject, userId)
        const dbRef = firebase.database().ref(`${userId}`)
        dbRef.push(laneObject).then(()=>{
            // console.log("Data saved successfully.");
            setAlert({show: true, alertText: 'Lane successfully added'})
            setLaneInput({laneTittle: ''})
            setShowAddLaneForm(false)
            setTimeout(() => {
                setShowModal(!showModal)
                setAlert({show: false, alertText: ''})
            }, 1500);
        }).catch((error)=> {
            // console.log("Data could not be saved." + error);
            setAlert({show:true, alertText:`The lane could not be saved. because of ${error}`})
        });
    }
    const deleteLane =(laneId)=>{
        const dbRef = firebase.database().ref(`${userId}/${laneId}`)
        dbRef.remove()
    }
    const addCard=(e)=>{
        e.preventDefault()
        console.log(cardInput)
    }
    const handleInput=(e, type)=>{
        const {id, value} = e.target
        if(type=== "lane"){
            setLaneInput({[id]:value})
        }
        if(type=== "card"){
            setCardInput({...cardInput,[id]:value})
        }
    }
    const openModal =(type, laneId)=>{
        setShowModal(!showModal)
        if(type === "addLane"){
            setShowAddLaneForm(true)
            setShowAddCardForm(false)
        }
        if(type === "addCard"){
            setShowAddCardForm(true)
            setShowAddLaneForm(false)
            setCardInput({...cardInput, laneId:laneId})
        }
    }
    const closeModal =()=>{
        setShowModal(!showModal)
        setShowAddCardForm(false)
        setShowAddLaneForm(false)
        setAlert({show: false, alertText: ''})
    }
    useEffect(()=>{
        let userId
        if(navigator.onLine){
            if(localStorage.userId){
                setUserId(localStorage.userId)
                firebase.database().ref(`${localStorage.userId}`).on('value', (response)=>{
                    const laneArray=[]
                    const data = response.val()
                    // console.log(data)
                    for (let key in data) {
                        laneArray.push({...data[key], id: key})
                    }
                    setAllLanes(laneArray)
                })
            }else {
                const userId = uuidv4();
                // console.log('local storage user id does not xists')
                // create unique id for user
                localStorage.setItem('userId', userId)
                setUserId(userId)
                firebase.database().ref(`${userId}`).on('value', (response)=>{
                    const laneArray=[]
                    const data = response.val()
                    // console.log(data)
                    for (let key in data) {
                        laneArray.push({...data[key], id: key})
                    }
                    setAllLanes(laneArray)
                })
            }
        }else {
            console.log('not online')
        }
    }, [isOffline])
    return (
        <section className='dashboard'>
            {
                showModal ?
            <div className="modalWindow">
                <div className="modal">
                    <div className="flexRow justifyCntEnd w100">
                        <button onClick={closeModal}><i className="fas fa-times"></i></button>
                    </div>
                    {
                        showAddLaneForm ?
                        <form onSubmit={(e)=>addLane( e, "lane")}>
                            <label htmlFor="laneTittle">Provide Lane Tittle</label>
                            <input type="text" id='laneTittle' 
                            value={laneInput.laneTittle} 
                            ref={inputLaneTittle}
                            onChange={(e)=>handleInput(e,"lane")}
                            placeholder='Enter Lane Tittle'
                            />
                            <button>Create Lane</button>
                        </form>
                        : null
                    }
                    {
                        showAddCardForm ?
                        <form onSubmit={(e)=>addCard( e, "card" )}>
                            <label htmlFor="cardTittle">Provide Lane Tittle</label>
                            <input type="text" id='cardTittle' 
                            value={cardInput.cardTittle} 
                            onChange={(e)=>handleInput(e,"card")}
                            placeholder='Enter Card Tittle'
                            />
                            <label htmlFor="cardType">select Type</label>
                            <select name="cardType" id="cardType" 
                                defaultValue={cardInput.cardType} required>
                                <option hidden>BUG</option>
                                <option value="BUG">BUG</option>
                                <option value="FEATURE">FEATURE</option>
                                <option value="REQUEST">REQUEST</option>
                            </select>
                            <button>Create Card</button>
                        </form>
                        : null
                    }
                    {
                        alert.show ?
                        <p className='alertText'>{alert.alertText}</p>
                        :null
                    }
                </div>
            </div>
            : null
            }
            <div className='dashboardCntnr'>
                {allLanes.length>0?
                allLanes.map(lane=>
                    <div key={lane.laneId} className="lane">
                        <div className="flexRow justifyCntBtwn w100">
                            <h3>{lane.laneTittle}</h3>
                            <button className='deleteLaneBtn' onClick={()=>deleteLane(lane.id)}><i className="fas fa-times"></i></button>
                        </div>
                        <button className='addCardBtn' onClick={()=>openModal('addCard', lane.id)}><i className="fas fa-plus"></i></button>
                        <div className="laneContent">
                        </div>
                    </div>
                )
                :
                <div className="lane">
                    <h3>there are currently no lanes</h3>
                </div>
            }
                <div className="lane">
                    <h3>create new lane</h3>
                    <button className="card" onClick={()=>openModal('addLane')}><i className="fas fa-plus"></i></button>
                </div>
            </div>
        </section>
    )
}

export default Dashboard