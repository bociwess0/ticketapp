import TicketForm from "@/components/TicketForm";
import React from "react";

interface Props {
  params: { id: string };
}

const EditTicket = async ({ params }: Props) => {
  const ticket = await prisma?.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return <p className=" text-destructive">Ticket not found!</p>;
  }

  return <TicketForm ticket={ticket} />;
};

export default EditTicket;