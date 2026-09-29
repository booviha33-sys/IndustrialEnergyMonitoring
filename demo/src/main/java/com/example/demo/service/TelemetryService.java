package com.example.demo.service;

import com.example.demo.entity.MaintenanceTicket;
import com.example.demo.entity.Telemetry;
import com.example.demo.repository.MaintenanceTicketRepository;
import com.example.demo.repository.TelemetryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TelemetryService {

    private final TelemetryRepository telemetryRepository;
    private final MaintenanceTicketRepository ticketRepository;

    public TelemetryService(
            TelemetryRepository telemetryRepository,
            MaintenanceTicketRepository ticketRepository) {

        this.telemetryRepository = telemetryRepository;
        this.ticketRepository = ticketRepository;
    }

    public Telemetry processTelemetry(
            Telemetry telemetry) {

        double power =
                telemetry.getVoltage()
                * telemetry.getCurrent();

        telemetry.setPower(power);

        if (telemetry.getTimestamp() == null) {
            telemetry.setTimestamp(
                    LocalDateTime.now()
            );
        }

        Telemetry saved =
                telemetryRepository.save(telemetry);

        /*
         * For the project prototype:
         * ambientLight < 100 represents dark/night condition.
         * Zero power during this condition creates a fault.
         */

        if (power == 0 &&
                telemetry.getAmbientLight() < 100) {

            MaintenanceTicket ticket =
                    new MaintenanceTicket();

            ticket.setStreetLightId(
                    telemetry.getStreetLightId()
            );

            ticket.setFaultType("POWER_FAILURE");

            ticket.setDescription(
                    "Zero power detected during night/active hours"
            );

            ticket.setPriority("HIGH");
            ticket.setStatus("OPEN");

            ticket.setCreatedAt(
                    LocalDateTime.now()
            );

            ticketRepository.save(ticket);
        }

        return saved;
    }
}