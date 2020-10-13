import { accessRequired } from "../errors";
import { r, cacheableData } from "../../models";

export const updateFeedback = async (
  _,
  { assignmentId, feedback },
  { user }
) => {
  try {
    const assignment = await cacheableData.assignment.load(assignmentId);
    const organization = await cacheableData.campaign.loadCampaignOrganization({
      campaignId: assignment.campaign_id
    });
    await accessRequired(user, organization.id, "SUPERVOLUNTEER");
    if (!feedback.createdBy || isNaN(feedback.createdBy)) {
      /* eslint-disable no-param-reassign */
      feedback.createdBy = user.id;
    }
    await r
      .knex("assignment")
      .where("id", assignmentId)
      .update({ feedback });
    return { id: assignmentId };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      `Error saving assignment texter feedback for assignmentId ${assignmentId}`
    );
    throw err;
  }
};
