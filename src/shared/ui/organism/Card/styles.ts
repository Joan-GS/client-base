import { Box, Button, Card, HStack, styled, Text } from '@gluestack-ui/themed';

export const StyledCard = styled(Card, {
  borderRadius: 12,
  overflow: 'hidden',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  marginBottom: 16,
  backgroundColor: '$neutral60',
});

export const StyledImageContainer = styled(Box, {
  width: '100%',
  height: 200,
  overflow: 'hidden',
});

export const StyledTextContainer = styled(Box, {
  padding: 12,
});

export const StyledName = styled(Text, {
  fontWeight: 'bold',
  fontSize: 18,
  marginBottom: 4,
});

export const StyledGrade = styled(Text, {
  color: '#8a8a8a',
  fontSize: 14,
  marginBottom: 4,
});

export const StyledAvgRating = styled(Text, {
  color: '#666666',
  fontSize: 14,
});

export const StyledFooterContainer = styled(HStack, {
  padding: 12,
  justifyContent: 'space-between',
  flexDirection: 'row',
});

export const StyledIconContainer = styled(HStack, {
  flexDirection: 'row',
  alignItems: 'center',
});

export const StyledButton = styled(Button, {
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '#E5E5E5',
  padding: 8,
  borderRadius: 8,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
});

