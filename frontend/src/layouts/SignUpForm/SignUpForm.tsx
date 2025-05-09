import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { signUpFormStyles } from './styles';

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
  isLoading: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState<SignUpFormData>({ username: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={signUpFormStyles.formBox}>
      <Typography variant="h5" gutterBottom>
        Registrace
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Uživatelské jméno"
        name="username"
        value={form.username}
        onChange={handleChange}
        sx={signUpFormStyles.input}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        sx={signUpFormStyles.input}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Heslo"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        sx={signUpFormStyles.input}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={signUpFormStyles.button}
      >
        {isLoading ? 'Registruji...' : 'Registrovat'}
      </Button>
    </Box>
  );
};

export default SignUpForm;
