import { FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";
import Container from "./Shared/Container";

const PricingComparisonTable = () => {
    return (

        <Container>
            <div className="overflow-x-auto mt-10">
                <h2 className="text-3xl font-bold text-base-800 text-center mb-6">
  Free vs Premium Features
</h2>
                <table className="min-w-full border border-gray-200 shadow rounded-lg overflow-hidden">
                    <thead className="bg-base-400 shadow">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-base-700">
                                Features
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-base-700">
                                Free
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-indigo-600 flex items-center justify-center gap-1">
                                <FaStar className="text-yellow-500" />
                                Premium
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y  divide-gray-200">
                        <tr>
                            <td className="px-4 py-3">Lesson Access</td>
                            <td className="px-4 py-3 text-center">Limited</td>
                            <td className="px-4 py-3 text-center">Unlimited</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3">Create Premium Lessons</td>
                            <td className="px-4 py-3 text-center text-red-500">
                                <FaTimesCircle size={18} className="mx-auto" />
                            </td>
                            <td className="px-4 py-3 text-center text-green-600">
                                <FaCheckCircle className="mx-auto"size={18} />
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3">Image Upload</td>
                            <td className="px-4 py-3 text-center text-red-500">
                                <FaTimesCircle className="mx-auto" size={18} />
                            </td>
                            <td className="px-4 py-3 text-center text-green-600">
                                <FaCheckCircle className="mx-auto" size={18} />
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3">Private Lessons</td>
                            <td className="px-4 py-3 text-center text-red-500">
                                <FaTimesCircle size={18}  className="mx-auto"/>
                            </td>
                            <td className="px-4 py-3 text-center text-green-600">
                                <FaCheckCircle size={18} className="mx-auto" />
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3">Ad-Free Experience</td>
                            <td className="px-4 py-3 text-center text-red-500">
                                <FaTimesCircle size={18} className="mx-auto" />
                            </td>
                            <td className="px-4 py-3 text-center text-green-600">
                                <FaCheckCircle size={18}  className="mx-auto"/>
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3">Priority Listing</td>
                            <td className="px-4 py-3 text-center">Standard</td>
                            <td className="px-4 py-3 text-center font-medium text-indigo-600">
                                Boosted
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3">Save Favorites</td>
                            <td className="px-4 py-3 text-center">Limited</td>
                            <td className="px-4 py-3 text-center">Unlimited</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3">Analytics & Insights</td>
                            <td className="px-4 py-3 text-center text-red-500">
                                <FaTimesCircle size={18} className="mx-auto" />
                            </td>
                            <td className="px-4 py-3 text-center text-green-600">
                                <FaCheckCircle size={18}  className="mx-auto"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Container>
    );
};

export default PricingComparisonTable;
