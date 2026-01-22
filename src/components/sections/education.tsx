'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { GraduationCap, Calendar, BookOpen, ExternalLink, Award } from 'lucide-react'
import { education, certifications } from '@/data/education'
import { SectionHeader } from '@/components/ui/section-header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export function Education() {
  return (
    <section id="education" className="section bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Education"
          subtitle="Academic background and certifications"
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Education entries */}
          <div className="lg:col-span-2 space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-violet rounded-xl">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {edu.degree} in {edu.field}
                          </h3>
                          {edu.inProgress && (
                            <Badge variant="secondary">In Progress</Badge>
                          )}
                        </div>

                        {edu.institutionUrl ? (
                          <a
                            href={edu.institutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline font-medium"
                          >
                            {edu.institution}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-primary-600 dark:text-primary-400 font-medium">
                            {edu.institution}
                          </span>
                        )}

                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-2">
                          <Calendar className="w-4 h-4" />
                          {edu.startDate} - {edu.endDate || 'Present'}
                        </div>

                        {edu.description && (
                          <p className="text-slate-600 dark:text-slate-300 mt-3">
                            {edu.description}
                          </p>
                        )}

                        {edu.coursework && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              <BookOpen className="w-4 h-4" />
                              Relevant Coursework
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {edu.coursework.map((course) => (
                                <Badge key={course}>{course}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Certifications */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-accent-amber" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Certifications
                </h3>
              </div>

              {certifications.map((cert) => (
                <a
                  key={cert.id}
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <Image
                          src={cert.badgeImage}
                          alt={cert.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {cert.name}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        {cert.issuer} • {cert.issueDate}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400">
                        View Credential
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
