import { useState, useEffect } from "react";
import styled from "styled-components";

import Plane from "./Plane";
import Form from "./Form";
import {useNavigate} from "react-router-dom";
const SeatSelect = ({ selectedFlight, setReservationId }) => {

    const [selectedSeat, setSelectedSeat] = useState("");
    const navigate = useNavigate();
    const handleSubmit = (e, formData) => {
        e.preventDefault();
        // TODO: POST info to server
        fetch("/api/add-reservation", {
            method: "POST",
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
            },
            body: JSON.stringify({...formData, flight: selectedFlight, seat:selectedSeat})
        })
        .then(res=>res.json()).then((data)=>{
            console.log("formData", formData)
            setReservationId(data.data.id)
            localStorage.setItem("reservationId", data.data.id)
            navigate("/confirmation");
        })
        .catch ((error)=>{
      
        })
    }

    return (
        <Wrapper>
            <h2>Select your seat and Provide your information!</h2>
            <>
                <FormWrapper>
                    <Plane setSelectedSeat={setSelectedSeat} selectedFlight={selectedFlight} />
                    <Form handleSubmit={handleSubmit} selectedSeat={selectedSeat} />
                </FormWrapper>
            </>
        </Wrapper>
    );
};

const FormWrapper = styled.div`
    display: flex;
    margin: 50px 0px;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
`

export default SeatSelect;
