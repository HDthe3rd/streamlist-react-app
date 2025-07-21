// Password Security Utils (Educational purposes)
export const passwordSecurity = {
  simpleHash: (password) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  },
  
  generateSalt: () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let salt = '';
    for (let i = 0; i < 16; i++) {
      salt += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return salt;
  },
  
  hashWithSalt: (password, salt) => {
    const saltedPassword = password + salt;
    return passwordSecurity.simpleHash(saltedPassword);
  },
  
  demonstratePasswordSecurity: (password) => {
    console.log('=== Password Security Demonstration ===');
    console.log('Original password:', password);
    
    const simpleHashResult = passwordSecurity.simpleHash(password);
    console.log('Stage 3 - Simple hash:', simpleHashResult);
    
    const salt = passwordSecurity.generateSalt();
    const saltedHash = passwordSecurity.hashWithSalt(password, salt);
    console.log('Stage 4 - Salt:', salt);
    console.log('Stage 4 - Salted hash:', saltedHash);
    console.log('Note: This is educational only. Use bcrypt in production!');
    
    return { simpleHashResult, salt, saltedHash };
  }
};