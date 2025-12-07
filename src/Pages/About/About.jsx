import React from 'react';
import Container from '../../Components/Shared/Container';

const About = () => {
    return (
        <Container>
            <h1 className="text-4xl md:text-5xl font-bold text-center my-20">
                About Us
            </h1>
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Purpose */}
                <section>
                    <h2 className="text-2xl font-semibold mb-3">🌱 Our Purpose</h2>
                    <p className="text-lg leading-relaxed">
                        Every day, people learn meaningful lessons — but many fade with time.
                        Digital Life Lessons helps you preserve personal wisdom, reflect on growth,
                        and revisit the insights that shape your journey.
                    </p>
                </section>
                {/* What We Do */}
                <section>
                    <h2 className="text-2xl font-semibold mb-3">💡 What We Do</h2>
                    <ul className="list-disc pl-6 space-y-2 text-lg">
                        <li>Create and store personal life lessons</li>
                        <li>Mark your important notes as favorites</li>
                        <li>Track reflection and growth progress</li>
                        <li>Explore lessons shared by the community</li>
                        <li>Organize, edit, and review insights anytime</li>
                    </ul>
                </section>
                {/* Mission */}
                <section>
                    <h2 className="text-2xl font-semibold mb-3">🎯 Our Mission</h2>
                    <p className="text-lg leading-relaxed">
                        Our mission is to empower individuals to learn from the past, grow in the present,
                        and inspire the future through meaningful shared experiences.
                    </p>
                </section>
                {/* Who We Are */}
                <section>
                    <h2 className="text-2xl font-semibold mb-3">👥 Who We Are</h2>
                    <p className="text-lg leading-relaxed">
                        We are creators, developers, and visionaries passionate about mindful living,
                        personal development, and building useful digital tools that matter.
                    </p>
                </section>
                {/* Vision */}
                <section>
                    <h2 className="text-2xl font-semibold mb-3">🚀 Our Vision</h2>
                    <p className="text-lg leading-relaxed">
                        To build the world’s largest community-driven library of life lessons —
                        where every story matters and every insight can inspire change.
                    </p>
                </section>
                {/* CTA */}
                <section>
                    <div className="p-6 mb-10 bg-base-100 shadow-2xl rounded-xl">
                        <h3 className="text-xl font-semibold mb-2">❤️ Join the Journey</h3>
                        <p className="text-lg leading-relaxed">
                            Start collecting your wisdom, explore insights from others, and grow with us.
                        </p>
                    </div>
                </section>
            </div>
        </Container>
    );
};

export default About;