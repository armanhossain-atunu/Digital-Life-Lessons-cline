import React from 'react';
import useAuth from '../../Hooks/useAuth';
import Banner from '../../Components/Home/Banner/Banner';
import WhyLearningMatters from '../../Components/Home/WhyLearningMatters/WhyLearningMatters';
import Card from '../../Components/Home/Card';
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
            <Card></Card>
        </div>
    );
};

export default Home;