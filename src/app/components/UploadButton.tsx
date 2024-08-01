import React, { useState } from 'react';
import { UploadButton } from '~/app/utils/uploadthing';
import { useAuth } from "@clerk/nextjs";
import { addDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '~/server/db';

interface AnalysisResponse {
  items: Array<{
    item: string;
    count: number;
  }>;
}

interface AnalysisResult {
  items: Array<{
    item: string;
    count: number;
  }>;
}

const Spinner = () => {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 576 512"
    >
      <path
        fill="currentColor"
        d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"
      />
    </svg>
  );
};

const CustomUploadButton: React.FC = () => {
  const { userId } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Analyzes the uploaded image using OpenAIs image analysis API
   * This function is called after a successful image upload
   * It triggerse the item addition process once analysis is complete
   */
  const analyzeImage = async (imageUrl: string) => {
    console.log('Starting image analysis for URL:', imageUrl);
    setIsAnalyzing(true);
    try{
      const response = await fetch('/api/OpenAI/analyzeImage', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ imageUrl })
      })

      const data = await response.json() as AnalysisResponse;
      // After successful analysis, add items to the database
      console.log('Analysis response:', data);
      await addItemsFromAnalysis(data);
    } catch (error) {
      console.error('Error analyzing image', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Adds items to Firestore based on the analysis result
   * This function is called by analyzeImage after successful image analysis
   * Then adds each item to the database
   */
  const addItemsFromAnalysis = async (analysisResult: AnalysisResult) => {
    console.log('Starting to add items from analysis result:', analysisResult);
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    try {
      for (const item of analysisResult.items) {
        console.log(`Processing item: ${item.item}, count: ${item.count}`);
        const itemName = item.item.trim();
        
        // Query to check if the item already exists
        const q = query(collection(db, 'items'), 
          where('name', '==', itemName),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
  
/*         if (!querySnapshot.empty) {
          // Item exists, update the count
          const existingItem = querySnapshot.docs[0];
          const existingCount = existingItem.data().count;
          await updateDoc(existingItem.ref, {
            count: existingCount + item.count
        }); */

        if (!querySnapshot.empty && querySnapshot.docs[0]) {
          // Item exists, update the count
          const existingItem = querySnapshot.docs[0];
          const existingData = existingItem?.data() as { count: number };
          const existingCount = existingData?.count ?? 0;

          await updateDoc(existingItem.ref, {
            count: existingCount + item.count
          });
          console.log(`Updated existing item: ${itemName}, new count: ${existingCount + item.count}`);
        } else {
          // Item doesn't exist, add it
          await addDoc(collection(db, 'items'), {
            name: itemName,
            count: item.count,
            userId: userId,
          });
          console.log(`Added new item: ${itemName}, count: ${item.count}`);
        }
      }
      alert("Items processed successfully");
      console.log('All items processed successfully');
    } catch (error) {
      console.error('Error processing items from analysis:', error);
    }
  };

  return (
    <div 
      className={`relative w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 ease-in-out ${
        isUploading ? 'animate-loading-color-change' : ''
      }`}
    >

      {/* UploadButton component handles the file upload process */}
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // After successful upload, trigger image analysis
          console.log('Upload completed, response:', res);
          if (res && res.length > 0 && res[0]?.url) {
            console.log('Valid URL found, starting analysis');
            void analyzeImage(res[0].url);
          } else {
            console.error('Upload completed, but no valid URL found');
          }
          setIsUploading(false);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
          setIsUploading(false);
        }}
        onUploadProgress={(progress) => {
          setIsUploading(true);
        }}
        appearance={{
          button: "absolute inset-0 w-full h-full opacity-0",
          allowedContent: "hidden",
        }}
      />

      {/* Display loading state or upload icon based on analysis status */}
      {isAnalyzing ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <Spinner />
        </div>
      ) : (
        <svg id='Camera_24' width='80' height='80' viewBox='0 0 40 34' xmlns='http://www.w3.org/2000/svg' className="absolute">
          <rect width='80' height='80' stroke='none' fill='#000000' opacity='0'/>
          <g transform="matrix(0.77 0 0 0.77 8 8)" >
            <path style={{ fill: 'rgb(0,0,0)' }} d="M 12.236328 4 C 11.478328 4 10.786266 4.4274688 10.447266 5.1054688 L 10.052734 5.8945312 C 9.7137344 6.5715313 9.0206719 7 8.2636719 7 L 4 7 C 2.895 7 2 7.895 2 9 L 2 22 C 2 23.105 2.895 24 4 24 L 26 24 C 27.105 24 28 23.105 28 22 L 28 9 C 28 7.895 27.105 7 26 7 L 21.736328 7 C 20.978328 7 20.286266 6.5725312 19.947266 5.8945312 L 19.552734 5.1054688 C 19.213734 4.4284687 18.520672 4 17.763672 4 L 12.236328 4 z M 6 5 C 5.448 5 5 5.448 5 6 L 8 6 C 8 5.448 7.552 5 7 5 L 6 5 z M 15 8 C 18.86 8 22 11.14 22 15 C 22 18.86 18.86 22 15 22 C 11.14 22 8 18.86 8 15 C 8 11.14 11.14 8 15 8 z M 24 9 C 24.552 9 25 9.448 25 10 C 25 10.552 24.552 11 24 11 C 23.448 11 23 10.552 23 10 C 23 9.448 23.448 9 24 9 z M 15 10 C 12.238576250846034 10 10 12.238576250846034 10 15 C 10 17.761423749153966 12.238576250846034 20 15 20 C 17.761423749153966 20 20 17.761423749153966 20 15 C 20 12.238576250846034 17.761423749153966 10 15 10 z" strokeLinecap="round" />
          </g>
        </svg>
      )}
    </div>
  );
};

export default CustomUploadButton;
