# 🌱 Digital Life Lessons  
A platform to share personal growth stories, life lessons, and motivational insights.  
Users can read lessons, like (favorite), comment, and interact in real-time.

---

## 🚀 Features

### 📝 Lessons  
- Add, view, edit & delete life lessons  
- Show More / Show Less description  
- Responsive lesson cards  

### ❤️ Favorite System  
- Logged-in users can favorite any lesson  
- Instant UI update (optimistic update)  
- Favorite count shows in real-time  
- Uses MongoDB `$addToSet` and `$pull`  

### 💬 Comments (Real-time)  
- Only logged-in users can comment  
- Auto reload comments every second  
- User name & photo displayed in each comment  
- Comment box disabled for non-auth users  

### 🔐 Authentication  
- Firebase Auth  
- Google Login  
- Email Login  

### ⚡ React Query Integrated  
- Optimistic UI  
- Cache update  
- Background data refresh  

---

## 🛠 Tech Stack

### **Frontend**
- React.js
- React Router
- Tailwind CSS
- React Query (TanStack Query)
- Axios
- Firebase Authentication

### **Backend**
- Node.js
- Express.js  
- MongoDB (Favorite, Comments, Lessons Collections)

---

## 📁 Project Structure

