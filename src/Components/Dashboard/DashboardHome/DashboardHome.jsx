import React from 'react';
import Container from '../../Shared/Container';
import TotalUsers from './DashboardHomeShared/TotalUsers';

const DashboardHome = () => {
    return (
        <Container>
            <h1 className="text-2xl text-center  font-semibold mb-6">Dashboard Home</h1>
            <div>
                <TotalUsers></TotalUsers>
            </div>
        </Container>
    );
};

export default DashboardHome;