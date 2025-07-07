import { Card, CardContent, Typography } from "@mui/material";

  const SimpleAccountCardUI = ({ account, index, onClick=() => {} }) => {
    return (
      <Card
        key={index}
        className="cursor-pointer hover:shadow-lg transition-shadow border"
        onClick={() => {
          onClick(account);
          close();
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>
            {account?.user_id || `Account ${index + 1}`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {account?.user_shortname}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {account?.email}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {account?.accountType}
          </Typography>
        </CardContent>
      </Card>
    )
  }

export default SimpleAccountCardUI;