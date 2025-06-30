import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { IMCSDetail } from "~/types/mcs-detail.type";
import { Image } from "expo-image";
import PagerView from "react-native-pager-view";
import mcsApiRequest from "~/apis/mcs.api";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Info Row Component
const InfoRow = ({ 
  label, 
  value, 
  valueStyle = "text-gray-800",
  icon
}: { 
  label: string; 
  value: string | number | undefined; 
  valueStyle?: string;
  icon?: string;
}) => (
  <View className="flex-row justify-between items-center py-2 px-3 bg-gray-50 rounded-lg mb-1">
    <View className="flex-row items-center flex-1">
      {icon && <Ionicons name={icon as any} size={16} color="#6B7280" className="mr-2" />}
      <Text className="text-sm text-gray-600 flex-1">
        {label}
      </Text>
    </View>
    <Text className={`text-sm font-medium ${valueStyle} max-w-[50%] text-right`} numberOfLines={2}>
      {value || 'N/A'}
    </Text>
  </View>
);

// Collapsible Section Component
const CollapsibleSection = ({ 
  title, 
  children, 
  defaultExpanded = false,
  icon
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultExpanded?: boolean;
  icon?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View className="border-b border-gray-200">
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between p-4 bg-white"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          {icon && <Ionicons name={icon as any} size={20} color="#374151" className="mr-3" />}
          <Text className="text-lg font-semibold text-gray-900">
            {title}
          </Text>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#6B7280" 
        />
      </TouchableOpacity>
      {isExpanded && (
        <View className="px-4 pb-4 bg-gray-50">
          {children}
        </View>
      )}
    </View>
  );
};

// Helper function to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

// Type cho route params
type RouteParams = {
  data: IMCSDetail;
};

const McsDetailStack = () => {
  const route = useRoute<RouteProp<{ McsDetail: RouteParams }, 'McsDetail'>>();
  const dataPrams = route?.params?.data;
  
  const [mcsInfo, setMcsInfo] = useState<IMCSDetail | null>(null);
  const [mcsImages, setMcsImages] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      if (!dataPrams) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const mcsData = dataPrams;
        
        const imagePromises = Array.from({ length: 6 }, (_, i) => {
          const imageIndex = i + 1;
          return mcsApiRequest.sGetImage(
            mcsData.ARTICLE_NUMBER_A,
            mcsData.SEASON_M,
            imageIndex
          );
        });

        const results = await Promise.allSettled(imagePromises);
        
        const images = results.map((result, index) => {
          if (result.status === "fulfilled" && result.value?.payload) {
            return result.value.payload;
          } else {
            console.error(`Error fetching image ${index + 1}:`, 
              result.status === "rejected" ? result.reason : "No payload");
            return null;
          }
        });
        
        const validImages = images.filter(img => img !== null);
        setMcsImages(validImages);
        
      } catch (error) {
        console.error('Error in fetchImages:', error);
        setMcsImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (dataPrams) {
      setMcsInfo(dataPrams);
      fetchImages();
    } else {
      setIsLoading(false);
    }
  }, [dataPrams]);

  // Handle image press
  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Handle modal page change
  const handleModalPageChange = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Render loading state
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-600">Loading product details...</Text>
      </View>
    );
  }

  // Render error state
  if (!mcsInfo) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="mt-2 text-gray-600">No data available</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Block Swiper 6 Images */}
      <View className="h-[220px] bg-white shadow-sm">
        {mcsImages.length > 0 ? (
          <>
            <PagerView 
              style={styles.container} 
              initialPage={0}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
              {mcsImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  className="justify-center items-center bg-gray-50"
                  onPress={() => handleImagePress(index)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: image ?? "" }}
                    style={styles.image}
                    contentFit="contain"
                    placeholder="Loading..."
                  />
                  {/* Overlay hint */}
                  <View className="absolute top-3 right-3 bg-black/40 rounded-full p-2">
                    <Ionicons name="expand" size={18} color="white" />
                  </View>
                </TouchableOpacity>
              ))}
            </PagerView>
            
            {/* Page Indicator */}
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {mcsImages.map((_, index) => (
                <View
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full mx-1 ${
                    index === currentPage ? 'bg-blue-500' : 'bg-white/70'
                  }`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                  }}
                />
              ))}
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center items-center bg-gray-50">
            <Ionicons name="image-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2">No images available</Text>
          </View>
        )}
      </View>

      {/* Product Info Sections */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header Info - Always Visible */}
        <View className="p-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {mcsInfo.ARTICLE_NUMBER_A}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
            <Text className="text-lg text-blue-600 font-medium ml-2">
              Season: {mcsInfo.SEASON_M}
            </Text>
          </View>
        </View>

        {/* 1. Basic Information */}
        <CollapsibleSection title="Basic Information" defaultExpanded={true} icon="information-circle-outline">
          <InfoRow label="Model Number" value={mcsInfo.MODEL_NUMBER_M} icon="barcode-outline" />
          <InfoRow label="Representative Article" value={mcsInfo.REP_ARTICLE_NUMBER_A} />
          <InfoRow label="Model Name" value={mcsInfo.MODEL_NAME_SHORT_M} icon="cube-outline" />
          <InfoRow label="Brand" value={mcsInfo.BRAND_M} icon="storefront-outline" />
          <InfoRow label="Gender" value={mcsInfo.GENDER_M} icon="person-outline" />
          <InfoRow label="SAP Gender" value={mcsInfo.SAP_GENDER} />
          <InfoRow label="Age Group" value={mcsInfo.AGE_GROUP_M} />
          <InfoRow label="Gender Age" value={mcsInfo.GENDER_AGE_M} />
          <InfoRow label="Business Segment" value={mcsInfo.BUSINESS_SEGMENT_M} />
          <InfoRow label="Sports Category" value={mcsInfo.SPORTS_CATEGORY_M} icon="football-outline" />
          <InfoRow label="Colorway" value={mcsInfo.COLORWAY_NAME_A} icon="color-palette-outline" />
          <InfoRow label="Season" value={mcsInfo.SEASON_M} icon="calendar-outline" />
          <InfoRow label="Season Sort" value={mcsInfo.SEASON_SORT} />
          <InfoRow label="Current Stage" value={mcsInfo.CURRENT_STAGE} />
          <InfoRow label="Article Status" value={mcsInfo.ARTICLE_STATUS_A} />
          <InfoRow label="Lifecycle State" value={mcsInfo.LIFECYCLESTATEA} />
          <InfoRow label="Creator" value={mcsInfo.CREATOR} icon="person-add-outline" />
          <InfoRow label="Modifier" value={mcsInfo.MODIFIER} />
          <InfoRow label="Create Date" value={formatDate(mcsInfo.CREATEDATE)} icon="time-outline" />
          <InfoRow label="Update Date" value={formatDate(mcsInfo.UPDATEDATE)} icon="time-outline" />
        </CollapsibleSection>

        {/* 2. Product Development */}
        <CollapsibleSection title="Product Development" icon="construct-outline">
          <InfoRow label="Development Center" value={mcsInfo.DEVELOPMENT_CENTER} />
          <InfoRow label="Development Type" value={mcsInfo.DEVELOPMENT_TYPE_A} />
          <InfoRow label="Development Track" value={mcsInfo.DEVELOPMENT_TRACK_A} />
          <InfoRow label="Commercialization Track" value={mcsInfo.COMMERCIALIZATION_TRACK_M} />
          <InfoRow label="Creation Center" value={mcsInfo.CREATION_CENTER_M} />
          <InfoRow label="Intended Use" value={mcsInfo.INTENDED_USE_M} icon="flash-outline" />
          <InfoRow label="Test Level" value={mcsInfo.TEST_LEVEL_M} icon="shield-checkmark-outline" />
          <InfoRow label="Test Analyst" value={mcsInfo.TEST_ANALYST_M} />
          <InfoRow label="Sample Size" value={mcsInfo.SAMPLE_SIZE_M} icon="resize-outline" />
          <InfoRow label="Shoe Construction" value={mcsInfo.SHOE_CONSTR_M} />
          <InfoRow label="Upper Material" value={mcsInfo.UPPER_M} />
          <InfoRow label="Silhouette Number" value={mcsInfo.SILHOUETTE_NUMBER_M} />
          <InfoRow label="Midsole Number" value={mcsInfo.MIDSOLE_NUMBER_M} />
          <InfoRow label="Outsole Number" value={mcsInfo.OUTSOLE_NUMBER_M} />
          <InfoRow label="Materialway ID" value={mcsInfo.MATERIALWAY_ID} />
        </CollapsibleSection>

        {/* 3. Production & Supply Chain */}
        <CollapsibleSection title="Production & Supply Chain" icon="factory-outline">
          <InfoRow label="Production Factory" value={mcsInfo.PROD_FACTORY} />
          <InfoRow label="Development Factory" value={mcsInfo.DEV_FACTORY} />
          <InfoRow label="Buy Plan Factory" value={mcsInfo.BUY_PLAN_FACTORY} />
          <InfoRow label="Factory Priority AF" value={mcsInfo.FACTORY_PRIORITY_AF} />
          <InfoRow label="Factory Priority MF" value={mcsInfo.FACTORY_PRIORITY_MF} />
          <InfoRow label="Lead Time AF" value={mcsInfo.LEAD_TIME_AF} icon="speedometer-outline" />
          <InfoRow label="Lead Time MF" value={mcsInfo.LEAD_TIME_MF} icon="speedometer-outline" />
          <InfoRow label="First Ex-Factory Date" value={formatDate(mcsInfo.FST_EX_FACTORY_DATE_M)} icon="calendar-outline" />
          <InfoRow label="Earliest Buy Ready Date" value={formatDate(mcsInfo.EARLIEST_BUYREADY_DATE)} />
          <InfoRow label="BOM Frozen Deadline" value={formatDate(mcsInfo.BOM_FROZEN_DEADLINE)} />
          <InfoRow label="CWA Deadline" value={formatDate(mcsInfo.CWA_DEADLINE)} />
          <InfoRow label="CWA Actual" value={formatDate(mcsInfo.CWA_ACTUAL)} />
          <InfoRow label="Yield Staff" value={mcsInfo.YIELD_STAFF_NM} icon="people-outline" />
          <InfoRow label="PBOM Staff" value={mcsInfo.PBOM_STAFF_NM} icon="people-outline" />
        </CollapsibleSection>

        {/* 4. Commercial & Marketing */}
        <CollapsibleSection title="Commercial & Marketing" icon="megaphone-outline">
          <InfoRow label="Retail Intro Date" value={formatDate(mcsInfo.RETAIL_INTRO_DATE_A)} icon="calendar-outline" />
          <InfoRow label="Marketing Activation Date" value={formatDate(mcsInfo.MARKETING_ACTIVATION_DATE_A)} />
          <InfoRow label="Marketing Forecast" value={mcsInfo.MARKETING_FORECAST_A?.toLocaleString()} icon="analytics-outline" />
          <InfoRow label="Target FOB" value={`$${mcsInfo.TARGET_FOB_A}`} icon="pricetag-outline" />
          <InfoRow label="Selling Regions" value={mcsInfo.SELLING_REGION_A?.split(',').join(', ')} icon="globe-outline" />
          <InfoRow label="Special Usage" value={mcsInfo.SPECIAL_USAGE_A} />
          <InfoRow label="Digital Creation" value={mcsInfo.DIGITAL_CREATION ? 'Yes' : 'No'} icon="code-outline" />
          <InfoRow label="Critical Product" value={mcsInfo.CRITICAL_PRODUCT ? 'Yes' : 'No'} icon="alert-circle-outline" />
          <InfoRow label="Priority Article" value={mcsInfo.PRIORITY_ARTICLE ? 'Yes' : 'No'} />
          <InfoRow label="CMA Risky Article" value={mcsInfo.CMA_RISKY_ARTICLE ? 'Yes' : 'No'} />
          <InfoRow label="CMA Category" value={mcsInfo.CMA_CATEGORY} />
          <InfoRow label="Product Weight" value={mcsInfo.PRODUCT_WEIGHT_ARTICLE} icon="weight-outline" />
        </CollapsibleSection>

        {/* 5. PDM Team */}
        <CollapsibleSection title="PDM Team" icon="people-circle-outline">
          <InfoRow label="PDM Manager" value={mcsInfo.PDM_MANAGER_NM} />
          <InfoRow label="PDM Leader" value={mcsInfo.PDM_LEADER_NM} />
          <InfoRow label="PDM Staff" value={mcsInfo.PDM_STAFF_NM} />
          <InfoRow label="OCPT Location" value={mcsInfo.OCPT_LOCATION} icon="location-outline" />
        </CollapsibleSection>

        {/* 6. Technical Details */}
        <CollapsibleSection title="Technical Details" icon="hardware-chip-outline">
          <InfoRow label="Sizes" value={mcsInfo.SIZES_M} icon="resize-outline" />
          <InfoRow label="Model Key" value={mcsInfo.MODEL_KEY} />
          <InfoRow label="Article Latest Key" value={mcsInfo.ARTICLE_LATEST_KEY} />
          <InfoRow label="EXTID" value={mcsInfo.EXTID} />
          <InfoRow label="EXTUID" value={mcsInfo.EXTUID} />
          <InfoRow label="Update Count" value={mcsInfo.UPDATECOUNTA2} />
          <InfoRow label="HS Release Date" value={formatDate(mcsInfo.HS_RELEASE_DATE)} />
          <InfoRow label="Last M" value={mcsInfo.LAST_M} />
        </CollapsibleSection>
      </ScrollView>

      {/* Fullscreen Image Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="black" />
          
          {/* Header with close button */}
          <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center p-4 bg-black/60">
            <View className="flex-row items-center">
              <Text className="text-white text-lg font-medium">
                {selectedImageIndex + 1} / {mcsImages.length}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCloseModal}
              className="bg-black/40 rounded-full p-3"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Fullscreen Image Pager */}
          <PagerView
            style={styles.modalPager}
            initialPage={selectedImageIndex}
            onPageSelected={(e) => handleModalPageChange(e.nativeEvent.position)}
          >
            {mcsImages.map((image, index) => (
              <View key={index} style={styles.modalImageContainer}>
                <TouchableOpacity
                  style={styles.modalImageTouchable}
                  onPress={handleCloseModal}
                  activeOpacity={1}
                >
                  <Image
                    source={{ uri: image ?? "" }}
                    style={styles.modalImage}
                    contentFit="contain"
                    placeholder="Loading..."
                  />
                </TouchableOpacity>
              </View>
            ))}
          </PagerView>

          {/* Bottom Page Indicator */}
          <View className="absolute bottom-8 left-0 right-0 flex-row justify-center">
            {mcsImages.map((_, index) => (
              <View
                key={index}
                className={`w-3 h-3 rounded-full mx-1 ${
                  index === selectedImageIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default McsDetailStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalPager: {
    flex: 1,
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageTouchable: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: screenWidth,
    height: screenHeight,
  },
});