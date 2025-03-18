import React, { JSX } from 'react';

type ValidationMode = 'HTML' | 'TEST';

export class TextValidator {
  constructor(
    private mode: ValidationMode = 'HTML', // Mode: HTML or TEST
    private className: string = 'fw-medium',
    private successStyle: React.CSSProperties = { color: 'green' },
    private errorStyle: React.CSSProperties = { color: 'red' }
  ) {}

  private handleResult(message: string, isValid: boolean): JSX.Element | {msg: string, status: boolean} {
    if (this.mode === 'TEST') {
      return {msg: message,status: isValid};
    }
    return (
      <p className={this.className} style={isValid ? this.successStyle : this.errorStyle}>
        {message}
      </p>
    );
  }

  valUsername(username: string): JSX.Element | {msg: string, status: boolean} {
    if (!username) {
      return this.handleResult('Username is required', false);
    }
    const minLength = 4;
    const maxLength = 20;
    const validPattern = /^[a-zA-Z0-9_]+$/;

    if (username.length < minLength) {
      return this.handleResult(`Username must be at least ${minLength} characters`, false);
    }
    if (username.length > maxLength) {
      return this.handleResult(`Username must be less than ${maxLength} characters`, false);
    }
    if (!validPattern.test(username)) {
      return this.handleResult('Username can only contain letters, numbers, and underscores', false);
    }
    return this.handleResult('Username is valid', true);
  }

  valEmail(email: string): JSX.Element | {msg: string, status: boolean} {
    if (!email) {
      return this.handleResult('Email is required', false);
    }
    const validPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validPattern.test(email)) {
      return this.handleResult('Please enter a valid email address', false);
    }
    return this.handleResult('Email is valid', true);
  }

  valPassword(password: string): JSX.Element | {msg: string, status: boolean} {
    if (!password) {
      return this.handleResult('Password is required', false);
    }
    const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPattern.test(password)) {
      return this.handleResult(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
        false
      );
    }
    return this.handleResult('Password is strong', true);
  }

  valConfirmPassword(password: string, confirmPassword: string): JSX.Element | {msg: string, status: boolean} {
    if (!confirmPassword) {
      return this.handleResult('Please confirm your password', false);
    }
    if (password !== confirmPassword) {
      return this.handleResult('Passwords do not match', false);
    }
    return this.handleResult('Passwords match', true);
  }

  valMobileNumber(mobileNumber: string): JSX.Element | {msg: string, status: boolean} {
    const mobileRegex = /^[+]?(\d{1,3})?[-\s.]?(\d{10})$/;

    if (!mobileNumber) {
      return this.handleResult('Please enter your mobile number.', false);
    }

    const match = mobileNumber.match(mobileRegex);

    if (!match) {
      return this.handleResult(
        'Invalid mobile number. Ensure it includes a valid country code or is in the correct format.',
        false
      );
    }

    const hasCountryCode = mobileNumber.startsWith('+') || /^[1-9]\d{0,2}/.test(match[1]);
    if (!hasCountryCode) {
      return this.handleResult('Please include a valid country code (e.g., +1 for the USA).', false);
    }

    const phoneNumberWithoutCode = match[2];
    if (phoneNumberWithoutCode.length !== 10) {
      return this.handleResult('Mobile number must be 10 digits long.', false);
    }

    return this.handleResult('Valid mobile number.', true);
  }
}
