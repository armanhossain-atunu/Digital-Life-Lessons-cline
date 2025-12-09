import React from 'react';
import useAuth from '../../Hooks/useAuth';
import Banner from '../../Components/Home/Banner/Banner';
import WhyLearningMatters from '../../Components/Home/WhyLearningMatters/WhyLearningMatters';
import Lessons from '../../Components/Home/Lessons/Lessons';

const Home = () => {
    const { loading } = useAuth()
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <Banner></Banner>
            <WhyLearningMatters></WhyLearningMatters>
            <Lessons></Lessons>
   
            
        </div>
    );
};

export default Home;