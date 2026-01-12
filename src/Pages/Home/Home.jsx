import React from 'react';
import useAuth from '../../Hooks/useAuth';
import Banner from '../../Components/Home/Banner/Banner';
import WhyLearningMatters from '../../Components/Home/WhyLearningMatters/WhyLearningMatters';
import Lessons from '../../Components/Home/Lessons/Lessons';
import LoadingSpinner from '../../Components/Shared/LoadingSpinner';
import TopContributors from '../../Components/Home/TopContributors';
import MostSavedLessons from '../../Components/MostSavedLessons/MostSavedLessons';
import PricingComparisonTable from '../../Components/PricingComparisonTable';
import AllLessonReviews from '../../Components/Home/AllLessonReviews';
import FAQ from '../../Components/Home/FAQ';
import Newsletter from '../../Components/Home/Newsletter';
import BackToTop from '../../Components/Home/BackToTop';
import Team from '../../Components/Home/Team';

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
            <BackToTop></BackToTop>
            <TopContributors></TopContributors>
            <MostSavedLessons></MostSavedLessons>
            <PricingComparisonTable></PricingComparisonTable>
            <AllLessonReviews></AllLessonReviews>
            <FAQ></FAQ>
            <Newsletter></Newsletter>
            <Team></Team>

        </div>
    );
};

export default Home;