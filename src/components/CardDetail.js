import React, { useEffect, useState } from 'react'

function CardDetail({selectedCard, allLanes, loadData, setAllLanes}) {

    const [laneDetail, setLaneDetail]=useState({})
    const [cardDetail, setCardDetail]=useState({})
    const [cardColors, setCardColors]=useState([])
    const [showDescriptionForm, setShowDescriptionForm]=useState(false)
    const [showLabelMenu, setShowLabelMenu]=useState(false)
    const [descInput, setDescInput]=useState('Add more detail description');
    const [labels, setLabels]=useState([
        {
            color: 'red',
            selected: 'false'
        },
        {
            color: 'orange',
            selected: 'false'
        },
        {
            color: 'yellow',
            selected: 'false'
        },
        {
            color: 'green',
            selected: 'false'
        },
        {
            color: 'blue',
            selected: 'false'
        }
    ])
    const addDescription=(e)=>{
        e.preventDefault()
        console.log(descInput)
        // saving the desicription
        const copyLanes = [...allLanes];
        copyLanes.forEach(lane=>{
            if(lane.laneId===selectedCard.laneId){
                lane.cards.forEach(card=>{
                    if(card.id === selectedCard.cardId){
                        card.cardDesc = descInput
                        console.log(card)
                        setCardDetail(card)
                    }
                })
            }
        })
        localStorage.setItem("lanes",  JSON.stringify(copyLanes))
        loadData()
        setShowDescriptionForm(!showDescriptionForm)
    }
    const handleDescInput=(e)=>{
        e.preventDefault()
        const {value} = e.target
        setDescInput(value)
        setCardDetail({...cardDetail, cardDesc : value})
    }
    const addLabel=(color)=>{
        const copyLanes = [...allLanes];
        copyLanes.forEach(lane=>{
            if(lane.laneId===selectedCard.laneId){
                lane.cards.forEach(card=>{
                    if(card.id === selectedCard.cardId){
                        if(card.colors){
                            card.colors.push(color)

                        }else {
                            card.colors = [color]
                        }
                    }
                })
            }
        })
        localStorage.setItem("lanes",  JSON.stringify(copyLanes))
        const copyLabels = [...labels];
        copyLabels.forEach(label=>{
            if(label.color === color){
                label.selected= true
            }
        })
        setLabels(copyLabels)
        loadDetails()
    }
    const removeLabel=(selectedColor)=>{
        const copyLanes = [...allLanes];
        copyLanes.forEach(lane=>{
            if(lane.laneId===selectedCard.laneId){
                lane.cards.forEach(card=>{
                    if(card.id === selectedCard.cardId){
                        const filteredColorList = card.colors.filter(color=>{return color !=selectedColor})
                        card.colors = filteredColorList
                    }
                })
            }
        })
        localStorage.setItem("lanes",  JSON.stringify(copyLanes))
        const copyLabels = [...labels];
        copyLabels.forEach(label=>{
            if(label.color === selectedColor){
                label.selected= false
            }
        })
        setLabels(copyLabels)
        loadDetails()

    }
    const loadDetails =()=>{
        allLanes.map(lane=>{
            const newLabelCopy = [...labels]
            if(lane.laneId === selectedCard.laneId){
                // setting all cards
                setLaneDetail(lane)
                lane.cards.map(card=>{
                    if(card.id===selectedCard.cardId){
                        // setting card detail
                        setCardDetail(card)
                        // setting up the labels array to see if the users color selected or not
                        if (card.colors){
                            setCardColors(card.colors)
                            card.colors.forEach(color=>{
                                newLabelCopy.forEach(label=>{
                                    if(label.color === color ){
                                        label.selected =true
                                    }
                                })
                            })
                        }
                    }
                })
            }
            setLabels(newLabelCopy)
        })

    }
    useEffect(()=>{
        loadDetails()
    },[])
    return (
        <div className='cardDetail'>
            <h3><i className="fas fa-credit-card"></i> {cardDetail.cardTittle}</h3>
            <div className="labels flexRow justifyCntBtwn w100">
                <div>
                    {
                        cardColors.length>0 ? <p className='smallTitle'>labels</p>: null
                    }
                    <div className="userLabels flexRow">
                        {  cardColors.map((color, idx)=>
                            <p key={`color${idx}`} className={`colorBox ${color}`}></p>
                        )}
                    </div>
                </div>
                <div className="labelContainer">
                    <div className="flexRow justifyCntEnd w100 ">
                        <button onClick={()=>setShowLabelMenu(!showLabelMenu)}><i className="fas fa-tags"></i> Add Label</button>
                    </div>
                    {
                        showLabelMenu ?
                    <ul className="labelMenu">
                        <li className='flexRow justifyCntBtwn w100'>
                            <p>label</p>
                            <button className='closeLabelMenu' onClick={()=>setShowLabelMenu(!showLabelMenu)}>
                                <i className='fas fa-times'></i>
                            </button>
                        </li>
                        {
                            labels.map((label, idx)=>
                                label.selected === true ?
                                <li key={`label${idx}`} ><button onClick={()=>removeLabel(label.color)} className={`${label.color} labelBox`}><i className="fas fa-check"></i></button></li>
                                :
                                <li key={`label${idx}`}><button onClick={()=>addLabel(label.color)} className={`${label.color} labelBox`}></button></li>
                            )
                        }
                    </ul>
                    : null
                    }
                </div>
            </div>
            <div className="cardDesc w100">
                <h4><i className="fas fa-align-left"></i> Description</h4>
                <form onSubmit={addDescription}>
                    <label className='sr-only' htmlFor="cardDescription">Add Descript</label>
                    {
                        showDescriptionForm ? 
                        <textarea id='cardDescription' className='descFormActive' placeholder='Add description' onChange={handleDescInput} value={cardDetail.cardDesc ? cardDetail.cardDesc : ''}/>
                        :
                        <p className='descFormInactive'  onClick={()=>setShowDescriptionForm(!showDescriptionForm)} >{cardDetail.cardDesc ? cardDetail.cardDesc : descInput} </p>
                    }
                    {
                        showDescriptionForm ?
                    <div>
                        <button className='btn saveBtn' onClick={addDescription}>save</button>
                        <button className='btn' onClick={()=>setShowDescriptionForm(!showDescriptionForm)}><i className="fas fa-times"></i></button>
                    </div>
                    : null
                    }
                </form>
            </div>
        </div>
    )
}

export default CardDetail
