import auth from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useEffect, useState } from "react";
import { IAccountReports } from '../../utils/entities/AccountReports';
import { IPostReports } from '../../utils/entities/PostReports';
import { TReportCategory, TReportCategorySnapshot } from "../../utils/entities/ReportsCategories";
import { FirestoreCollections } from "../../utils/lib/Consts";
import { errorToast } from "../../utils/lib/Toasts";
import { errorLogger } from '../../utils/lib/errors/ErrorLogger';
import { IOptionsVM } from "../../utils/viewModels/ReportsCategoriesVM";

type TReportServiceProps = {
    isAccountReport?: boolean;
    postOrAccountId: string;
}

export const _reportService = ({ postOrAccountId, isAccountReport }: TReportServiceProps) => {
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState<IOptionsVM[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<TReportCategory>({
        description: "",
        iconLibrary: "",
        iconName: "",
        name: "",
        priority: "Low"
    });

    const fetchCategories = async () => {
        try {
            const querySnapshot = await firestore()
                .collection(FirestoreCollections.REPORTS_CATEGORIES)
                .get();

            const categoriesData = querySnapshot.docs.map(doc => {
                const data = {
                    id: doc.id,
                    data: { ...doc.data() as TReportCategory }
                } as TReportCategorySnapshot;

                return data;
            });

            const categoriesVM: IOptionsVM[] = categoriesData.map(category => {
                return {
                    id: category.id,
                    name: category.data.name,
                    description: category.data.description,
                    iconName: category.data.iconName,
                    iconLibrary: category.data.iconLibrary,
                    priority: category.data.priority
                } as IOptionsVM;
            });

            const otherIndex = categoriesVM.findIndex(category => category.name === "Other");
            const [otherCategory] = categoriesVM.splice(otherIndex, 1);
            categoriesVM.push(otherCategory);

            setCategories(categoriesVM);
        } catch (error) {
            errorLogger(
                error,
                "Error fetching categories > _reportService.fetchCategories function.",
                auth().currentUser
            )

            errorToast("Error fetching categories");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep(previousStep => previousStep - 1); // Move to the previous step
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setStep(2); // Move to the next step
    };

    const handleOptionPress = (option: IOptionsVM) => {
        if (option) {
            handleCategorySelect(option);
        }
    };

    function handleReports (
        collectionName: FirestoreCollections.POST_REPORTS | FirestoreCollections.USER_REPORTS,
        reportDescription
    ): {
        collectionRef: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>, 
        reportData: IPostReports | IAccountReports
    } {
        const collectionRef = firestore().collection(collectionName);

        /** 
         * THIS OBJECT CAN BE OF TYPE 
         * @return {IPostReports} OR 
         * @return {IUserReports}
        */
        let reportData: IPostReports | IAccountReports = null;
        
        if (isAccountReport) {
            reportData = {
                userId: postOrAccountId,
                reportReason: selectedCategory.name,
                reportedBy: auth().currentUser.uid,
                description: reportDescription,
                status: "Pending",
                priority: selectedCategory.priority,
                reportCreationDate: new Date().toISOString(),
                reportCreationDateTimestamp: Date.now(),
                resolution: "",
                resolutionDate: "",
                resolutionDateTimestamp: 0,
                resolutionBy: ""
            };
        } else {
            reportData = {
                postId: postOrAccountId,
                reportReason: selectedCategory.name,
                reportedBy: auth().currentUser.uid,
                description: reportDescription,
                status: "Pending",
                priority: selectedCategory.priority,
                reportCreationDate: new Date().toISOString(),
                reportCreationDateTimestamp: Date.now(),
                resolution: "",
                resolutionDate: "",
                resolutionDateTimestamp: 0,
                resolutionBy: ""
            };
        }

        return { collectionRef, reportData };
    }


    const handleSubmit = async ({ reportDescription }) => {
        setLoading(true);
        try {
            const { collectionRef, reportData } = handleReports(
                isAccountReport ? FirestoreCollections.USER_REPORTS : FirestoreCollections.POST_REPORTS,
                reportDescription
            );

            await collectionRef.add(reportData);
            console.log("Submitting report:", selectedCategory, reportDescription);
            setStep(3); // Move to the final step
        } catch (error) {
            errorLogger(
                error,
                "Error submitting report > _reportService.handleSubmit function.",
                auth().currentUser
            )

            errorToast("Error submitting report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        step,
        categories,
        selectedCategory,
        handleBack,
        handleCategorySelect,
        handleOptionPress,
        handleSubmit,
        loading
    };
}
