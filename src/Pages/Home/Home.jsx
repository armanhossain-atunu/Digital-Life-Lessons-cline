import React from 'react';
import useAuth from '../../Hooks/useAuth';
import Banner from '../../Components/Home/Banner/Banner';
import WhyLearningMatters from '../../Components/Home/WhyLearningMatters/WhyLearningMatters';
import Lessons from '../../Components/Home/Lessons/Lessons';
import LoadingSpinner from '../../Components/Shared/LoadingSpinner';
import TopContributors from '../../Components/Home/TopContributors';
import MostSavedLessons from '../../Components/MostSavedLessons/MostSavedLessons';
import PricingComparisonTable from '../../Components/PricingComparisonTable';
import ReportLesson from '../Reports/ReportLesson';


const Home = () => {
    const { loading } = useAuth()
    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }
    return (
        <div>
            <Banner></Banner>
            <WhyLearningMatters></WhyLearningMatters>
            <Lessons></Lessons>
            <TopContributors></TopContributors>
            <MostSavedLessons></MostSavedLessons>
            <PricingComparisonTable></PricingComparisonTable>
       
           
        
        </div>
    );
};

export default Home;