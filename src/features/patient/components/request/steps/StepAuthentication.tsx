import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthenticated, nextStep } from '@/api/slices/requestSlice';
import { useNavigate } from 'react-router-dom';

const StepAuthentication: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authState = useSelector((state: any) => state.auth); // Obținem starea de autentificare
    const user = authState?.clinicUser; // Verificăm dacă utilizatorul este autentificat

    // Dacă utilizatorul este autentificat, trecem direct la pasul următor
    if (user) {
        dispatch(setAuthenticated(true));
        dispatch(nextStep());
        return null;
    }

    const [hasAccount, setHasAccount] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Gestionăm schimbarea valorilor din input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Trimiterea formularului
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setAuthenticated(false)); // Marcăm utilizatorul ca neautentificat
        dispatch(nextStep()); // Trecem la pasul următor (Calendar)
    };

    return (
        <div>
            <h2>Autentificare</h2>
            <p>Ai deja un cont?</p>
            <button onClick={() => setHasAccount(true)}>Da</button>
            <button onClick={() => setHasAccount(false)}>Nu</button>

            {hasAccount ? (
                <button onClick={() => navigate('/login')}>Conectează-te</button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Nume" value={formData.name} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input type="tel" name="phone" placeholder="Telefon" value={formData.phone} onChange={handleChange} required />
                    <button type="submit">Continuă</button>
                </form>
            )}
        </div>
    );
};

export default StepAuthentication;